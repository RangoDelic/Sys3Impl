const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Mock gene analysis function
const performGeneAnalysis = (geneticData, ancestryData, medicalHistory) => {
    // This is a simplified mock analysis
    const mockResults = {
        analyzedGenes: ['BRCA1', 'BRCA2', 'APOE', 'CFTR', 'ACTN3', 'MCM6'],
        riskVariants: [],
        beneficialTraits: [],
        overallRiskScore: Math.random() * 100,
        analysisDate: new Date().toISOString()
    };

    // Mock risk variants based on ancestry
    if (ancestryData.european > 0.5) {
        mockResults.riskVariants.push({
            gene: 'BRCA1',
            variant: '5382insC',
            condition: 'Breast Cancer',
            riskLevel: 'moderate',
            riskPercentage: 15 + Math.random() * 20
        });
    }

    if (ancestryData.asian > 0.3) {
        mockResults.riskVariants.push({
            gene: 'APOE',
            variant: 'e3/e4',
            condition: 'Alzheimer\'s Disease',
            riskLevel: 'low',
            riskPercentage: 5 + Math.random() * 15
        });
    }

    // Mock beneficial traits
    mockResults.beneficialTraits.push({
        gene: 'ACTN3',
        variant: 'R/R',
        trait: 'Enhanced Athletic Performance',
        category: 'Physical Performance',
        confidence: 'high'
    });

    if (ancestryData.european > 0.7) {
        mockResults.beneficialTraits.push({
            gene: 'MCM6',
            variant: 'C/T',
            trait: 'Lactose Tolerance',
            category: 'Dietary',
            confidence: 'high'
        });
    }

    return mockResults;
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
        const analysisResults = performGeneAnalysis(geneticDataRaw, ancestryData, medicalHistory);

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