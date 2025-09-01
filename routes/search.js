const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/search - Global search across profile, skills, and projects
router.get('/', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = `%${query.trim()}%`;
    
    // Search in profile
    const profileResults = await db.all(`
      SELECT 'profile' as type, name as title, email as description, 
             'Profile Information' as category, id
      FROM profile 
      WHERE name LIKE $1 OR email LIKE $2 OR education LIKE $3
    `, [searchTerm, searchTerm, searchTerm]);
    
    // Search in skills
    const skillResults = await db.all(`
      SELECT 'skill' as type, name as title, 
             CASE 
               WHEN proficiency = 5 THEN 'Expert level'
               WHEN proficiency = 4 THEN 'Advanced level'
               WHEN proficiency = 3 THEN 'Intermediate level'
               WHEN proficiency = 2 THEN 'Beginner level'
               ELSE 'Basic level'
             END as description,
             category, id
      FROM skills 
      WHERE name LIKE $1 OR category LIKE $2
    `, [searchTerm, searchTerm]);
    
    // Search in projects
    const projectResults = await db.all(`
      SELECT 'project' as type, title, description, 
             'Project' as category, id
      FROM projects 
      WHERE title LIKE $1 OR description LIKE $2
    `, [searchTerm, searchTerm]);
    
    // Search in work experience
    const workResults = await db.all(`
      SELECT 'work' as type, position as title, 
             company || ' - ' || COALESCE(description, '') as description,
             'Work Experience' as category, id
      FROM work_experience 
      WHERE company LIKE $1 OR position LIKE $2 OR description LIKE $3
    `, [searchTerm, searchTerm, searchTerm]);
    
    // Combine all results
    const allResults = [
      ...profileResults,
      ...skillResults,
      ...projectResults,
      ...workResults
    ];
    
    // Sort results by relevance (exact matches first, then partial matches)
    allResults.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query.toLowerCase();
      const bExact = b.title.toLowerCase() === query.toLowerCase();
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.title.toLowerCase().indexOf(query.toLowerCase()) - b.title.toLowerCase().indexOf(query.toLowerCase());
    });
    
    res.json({
      success: true,
      query: query.trim(),
      count: allResults.length,
      data: allResults
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to perform search'
    });
  }
});

// GET /api/search/advanced - Advanced search with filters
router.get('/advanced', async (req, res) => {
  try {
    const { q: query, type, category, limit = 20 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid search query',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = `%${query.trim()}%`;
    let results = [];
    
    // Filter by type if specified
    if (type && !['profile', 'skill', 'project', 'work'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid type filter',
        message: 'Type must be one of: profile, skill, project, work'
      });
    }
    
    if (!type || type === 'profile') {
      const profileResults = await db.all(`
        SELECT 'profile' as type, name as title, email as description, 
               'Profile Information' as category, id
        FROM profile 
        WHERE name LIKE $1 OR email LIKE $2 OR education LIKE $3
      `, [searchTerm, searchTerm, searchTerm]);
      results.push(...profileResults);
    }
    
    if (!type || type === 'skill') {
      const skillResults = await db.all(`
        SELECT 'skill' as type, name as title, 
               CASE 
                 WHEN proficiency = 5 THEN 'Expert level'
                 WHEN proficiency = 4 THEN 'Advanced level'
                 WHEN proficiency = 3 THEN 'Intermediate level'
                 WHEN proficiency = 2 THEN 'Beginner level'
                 ELSE 'Basic level'
               END as description,
               category, id
        FROM skills 
        WHERE name LIKE $1 OR category LIKE $2
        ${category ? 'AND category = $3' : ''}
      `, category ? [searchTerm, searchTerm, category] : [searchTerm, searchTerm]);
      results.push(...skillResults);
    }
    
    if (!type || type === 'project') {
      const projectResults = await db.all(`
        SELECT 'project' as type, title, description, 
               'Project' as category, id
        FROM projects 
        WHERE title LIKE $1 OR description LIKE $2
      `, [searchTerm, searchTerm]);
      results.push(...projectResults);
    }
    
    if (!type || type === 'work') {
      const workResults = await db.all(`
        SELECT 'work' as type, position as title, 
               company || ' - ' || COALESCE(description, '') as description,
               'Work Experience' as category, id
        FROM work_experience 
        WHERE company LIKE $1 OR position LIKE $2 OR description LIKE $3
      `, [searchTerm, searchTerm, searchTerm]);
      results.push(...workResults);
    }
    
    // Apply limit
    results = results.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      query: query.trim(),
      type: type || 'all',
      category: category || 'all',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error performing advanced search:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to perform advanced search'
    });
  }
});

module.exports = router;
