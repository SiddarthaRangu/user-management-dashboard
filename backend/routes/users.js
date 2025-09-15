const express = require('express');
const router = express.Router();
const db = require('../database.js');

const validateUserData = (user) => {
    if (!user.name || !user.email || !user.phone) {
        return "Name, email, and phone are required fields.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        return "Please enter a valid email address.";
    }
    return null;
};

router.get("/", (req, res) => {
    const sql = "SELECT * FROM users ORDER BY name";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            res.status(500).json({ "error": "Failed to retrieve users" });
            return;
        }
        const users = rows.map(user => ({
            ...user,
            address: user.address ? JSON.parse(user.address) : {}
        }));
        res.json({ "message": "success", "data": users });
    });
});

router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
            res.status(500).json({ "error": "Failed to retrieve user" });
            return;
        }
        if (row) {
            row.address = row.address ? JSON.parse(row.address) : {};
            res.json({ "message": "success", "data": row });
        } else {
            res.status(404).json({ "error": "User not found" });
        }
    });
});

router.post("/", (req, res) => {
    const validationError = validateUserData(req.body);
    if (validationError) {
        return res.status(400).json({ "error": validationError });
    }

    const { name, email, phone, company, address } = req.body;
    
    const addressString = JSON.stringify(address || {
        street: '',
        city: '',
        zipcode: '',
        geo: { lat: '', lng: '' }
    });
    
    const sql = `INSERT INTO users (name, email, phone, company, address) VALUES (?,?,?,?,?)`;

    db.run(sql, [name, email, phone, company || '', addressString], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed: users.email")) {
                return res.status(409).json({ error: "This email address is already registered." });
            }
            return res.status(500).json({ error: "Unable to save user. Please try again." });
        }
        
        res.status(201).json({
            "message": "User created successfully",
            "data": { 
                id: this.lastID, 
                name, 
                email, 
                phone, 
                company: company || '', 
                address: address || {} 
            }
        });
    });
});

router.put("/:id", (req, res) => {
    const validationError = validateUserData(req.body);
    if (validationError) {
        return res.status(400).json({ "error": validationError });
    }

    const { name, email, phone, company, address } = req.body;
    const addressString = JSON.stringify(address || {});
    const sql = `UPDATE users SET name = ?, email = ?, phone = ?, company = ?, address = ? WHERE id = ?`;

    db.run(sql, [name, email, phone, company || '', addressString, req.params.id], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed: users.email")) {
                return res.status(409).json({ error: "This email address is already registered." });
            }
            return res.status(500).json({ "error": "Unable to update user. Please try again." });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ "error": "User not found" });
        }
        
        res.json({ 
            "message": "User updated successfully", 
            "data": { id: req.params.id, name, email, phone, company: company || '', address: address || {} }
        });
    });
});

router.delete("/:id", (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ "error": "Unable to delete user. Please try again." });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ "error": "User not found" });
        }
        
        res.status(200).json({ "message": "User deleted successfully" });
    });
});

module.exports = router;