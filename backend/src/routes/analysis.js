const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Mock gene analysis function with patient-specific results
const performGeneAnalysis = (geneticData, ancestryData, medicalHistory, patientId) => {
    // Base analyzed genes for all patients
    const baseGenes = ['BRCA1', 'BRCA2', 'APOE', 'CFTR', 'ACTN3', 'MCM6'];
    
    // Create distinct results based on patient ID
    const patientProfiles = {
        1: {
            analyzedGenes: [...baseGenes, 'TP53', 'PALB2'],
            riskVariants: [
                {
                    gene: 'BRCA2',
                    variant: '6174delT',
                    condition: 'Breast/Ovarian Cancer',
                    riskLevel: 'high',
                    riskPercentage: 45.2
                },
                {
                    gene: 'TP53',
                    variant: 'R175H',
                    condition: 'Li-Fraumeni Syndrome',
                    riskLevel: 'moderate',
                    riskPercentage: 22.7
                }
            ],
            beneficialTraits: [
                {
                    gene: 'ACTN3',
                    variant: 'R/R',
                    trait: 'Enhanced Fast-Twitch Muscle Performance',
                    category: 'Athletic Performance',
                    confidence: 'high'
                }
            ],
            overallRiskScore: 68.5
        },
        2: {
            analyzedGenes: [...baseGenes, 'LDLR', 'PCSK9'],
            riskVariants: [
                {
                    gene: 'APOE',
                    variant: 'e4/e4',
                    condition: 'Alzheimer\'s Disease',
                    riskLevel: 'high',
                    riskPercentage: 55.8
                },
                {
                    gene: 'LDLR',
                    variant: 'G571E',
                    condition: 'Familial Hypercholesterolemia',
                    riskLevel: 'moderate',
                    riskPercentage: 31.4
                }
            ],
            beneficialTraits: [
                {
                    gene: 'MCM6',
                    variant: 'C/T',
                    trait: 'Lactose Tolerance',
                    category: 'Dietary',
                    confidence: 'high'
                },
                {
                    gene: 'PCSK9',
                    variant: 'R46L',
                    trait: 'Low LDL Cholesterol',
                    category: 'Cardiovascular Health',
                    confidence: 'moderate'
                }
            ],
            overallRiskScore: 42.3
        },
        3: {
            analyzedGenes: [...baseGenes, 'CYP2D6', 'VKORC1'],
            riskVariants: [
                {
                    gene: 'CFTR',
                    variant: 'F508del',
                    condition: 'Cystic Fibrosis Carrier',
                    riskLevel: 'low',
                    riskPercentage: 8.1
                }
            ],
            beneficialTraits: [
                {
                    gene: 'CYP2D6',
                    variant: '*1/*1',
                    trait: 'Normal Drug Metabolism',
                    category: 'Pharmacogenetics',
                    confidence: 'high'
                },
                {
                    gene: 'VKORC1',
                    variant: 'GG',
                    trait: 'Normal Warfarin Sensitivity',
                    category: 'Drug Response',
                    confidence: 'high'
                },
                {
                    gene: 'MCM6',
                    variant: 'C/T',
                    trait: 'Lactose Tolerance',
                    category: 'Dietary',
                    confidence: 'high'
                }
            ],
            overallRiskScore: 18.7
        },
        4: {
            analyzedGenes: [...baseGenes, 'HLA-B', 'G6PD'],
            riskVariants: [
                {
                    gene: 'BRCA1',
                    variant: '185delAG',
                    condition: 'Hereditary Breast Cancer',
                    riskLevel: 'moderate',
                    riskPercentage: 28.9
                },
                {
                    gene: 'G6PD',
                    variant: 'A-',
                    condition: 'G6PD Deficiency',
                    riskLevel: 'low',
                    riskPercentage: 12.3
                }
            ],
            beneficialTraits: [
                {
                    gene: 'HLA-B',
                    variant: 'B*57:01',
                    trait: 'HIV Elite Controller',
                    category: 'Immune Response',
                    confidence: 'moderate'
                },
                {
                    gene: 'ACTN3',
                    variant: 'R/X',
                    trait: 'Mixed Athletic Performance',
                    category: 'Physical Performance',
                    confidence: 'moderate'
                }
            ],
            overallRiskScore: 35.6
        }
    };

    // Get the profile for this patient, or use a default if not found
    const profile = patientProfiles[patientId] || {
        analyzedGenes: baseGenes,
        riskVariants: [],
        beneficialTraits: [
            {
                gene: 'ACTN3',
                variant: 'R/R',
                trait: 'Enhanced Athletic Performance',
                category: 'Physical Performance',
                confidence: 'high'
            }
        ],
        overallRiskScore: 25.0 + (patientId * 5)
    };

    return {
        ...profile,
        analysisDate: new Date().toISOString()
    };
};

// Perform gene expression analysis
router.post('/analyze', authMiddleware, roleMiddleware([1, 2]), async (req, res) => {
    try {
        const userId = req.user.id;
        let patientId;

        if (req.user.user_role === 1) { // Patient requesting their own analysis
            const [patients] = await db.execute(
                'SELECT id FROM patients WHERE user_id = ?',
                [userId]
            );
            if (patients.length === 0) {
                return res.status(404).json({ error: 'Patient record not found' });
            }
            patientId = patients[0].id;
        } else { // Counselor analyzing a patient
            patientId = req.body.patientId;
            if (!patientId) {
                return res.status(400).json({ error: 'Patient ID required' });
            }
        }

        // Get genetic data
        const [geneticData] = await db.execute(
            'SELECT genetic_data_raw, ancestry_data FROM genetic_data WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1',
            [patientId]
        );

        if (geneticData.length === 0) {
            return res.status(400).json({ error: 'No genetic data found for analysis' });
        }

        // Get medical history
        const [patients] = await db.execute(
            'SELECT medical_history FROM patients WHERE id = ?',
            [patientId]
        );

        const geneticDataRaw = JSON.parse(geneticData[0].genetic_data_raw);
        const ancestryData = JSON.parse(geneticData[0].ancestry_data);
        const medicalHistory = patients[0]?.medical_history || '';

        // Perform mock analysis
        const analysisResults = performGeneAnalysis(geneticDataRaw, ancestryData, medicalHistory, patientId);

        // Store analysis results
        await db.execute(
            'INSERT INTO gene_expressions (patient_id, gene_expression_result) VALUES (?, ?)',
            [patientId, JSON.stringify(analysisResults)]
        );

        res.json({
            message: 'Analysis completed successfully',
            results: analysisResults
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get analysis results
router.get('/results', authMiddleware, roleMiddleware([1, 2]), async (req, res) => {
    try {
        const userId = req.user.id;
        let patientId;

        if (req.user.user_role === 1) { // Patient
            const [patients] = await db.execute(
                'SELECT id FROM patients WHERE user_id = ?',
                [userId]
            );
            if (patients.length === 0) {
                return res.status(404).json({ error: 'Patient record not found' });
            }
            patientId = patients[0].id;
        } else { // Counselor
            patientId = req.query.patientId;
            if (!patientId) {
                return res.status(400).json({ error: 'Patient ID required' });
            }
        }

        const [results] = await db.execute(
            'SELECT gene_expression_result, analysis_date FROM gene_expressions WHERE patient_id = ? ORDER BY analysis_date DESC',
            [patientId]
        );

        const analysisResults = results.map(result => ({
            ...JSON.parse(result.gene_expression_result),
            analysisDate: result.analysis_date
        }));

        res.json({ results: analysisResults });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Generate recommendations (counselors only)
router.post('/recommendations', authMiddleware, roleMiddleware([2]), async (req, res) => {
    try {
        const { patientId, recommendations } = req.body;
        const counselorId = req.user.id;

        // Get counselor record
        const [counselors] = await db.execute(
            'SELECT id FROM genetic_counselors WHERE user_id = ?',
            [counselorId]
        );

        if (counselors.length === 0) {
            return res.status(404).json({ error: 'Counselor record not found' });
        }

        await db.execute(
            'INSERT INTO recommendations (patient_id, counselor_id, recommendation_results) VALUES (?, ?, ?)',
            [patientId, counselors[0].id, JSON.stringify(recommendations)]
        );

        res.json({ message: 'Recommendations saved successfully' });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;