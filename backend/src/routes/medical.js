const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Update medical history (patients only)
router.put('/history', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { medicalHistory } = req.body;
        const userId = req.user.id;

        await db.execute(
            'UPDATE patients SET medical_history = ? WHERE user_id = ?',
            [medicalHistory, userId]
        );

        res.json({ message: 'Medical history updated successfully' });
    } catch (error) {
        console.error('Medical history update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get medical history (patients only)
router.get('/history', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const userId = req.user.id;

        const [patients] = await db.execute(
            'SELECT medical_history FROM patients WHERE user_id = ?',
            [userId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ error: 'Patient record not found' });
        }

        res.json({ medicalHistory: patients[0].medical_history });
    } catch (error) {
        console.error('Get medical history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Upload genetic data (patients only)
router.post('/genetic-data', authMiddleware, roleMiddleware([1]), async (req, res) => {
    try {
        const { geneticDataRaw, ancestryData } = req.body;
        const userId = req.user.id;

        // Get patient ID
        const [patients] = await db.execute(
            'SELECT id FROM patients WHERE user_id = ?',
            [userId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ error: 'Patient record not found' });
        }

        const patientId = patients[0].id;

        // Insert genetic data
        await db.execute(
            'INSERT INTO genetic_data (patient_id, genetic_data_raw, ancestry_data) VALUES (?, ?, ?)',
            [patientId, JSON.stringify(geneticDataRaw), JSON.stringify(ancestryData)]
        );

        res.json({ message: 'Genetic data uploaded successfully' });
    } catch (error) {
        console.error('Genetic data upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get genetic data (patients and counselors)
router.get('/genetic-data', authMiddleware, roleMiddleware([1, 2]), async (req, res) => {
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
        } else {
            // For counselors, they would need patient ID parameter
            patientId = req.query.patientId;
            if (!patientId) {
                return res.status(400).json({ error: 'Patient ID required' });
            }
        }

        const [geneticData] = await db.execute(
            'SELECT genetic_data_raw, ancestry_data, created_at FROM genetic_data WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1',
            [patientId]
        );

        if (geneticData.length === 0) {
            return res.status(404).json({ error: 'No genetic data found' });
        }

        const data = geneticData[0];
        res.json({
            geneticDataRaw: JSON.parse(data.genetic_data_raw),
            ancestryData: JSON.parse(data.ancestry_data),
            createdAt: data.created_at
        });
    } catch (error) {
        console.error('Get genetic data error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;