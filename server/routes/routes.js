const express = require('express');
const userController = require('../controllers/userController');
const departmentController = require('../controllers/departmentController');
const projectController = require('../controllers/projectController');
const roleController = require('../controllers/roleController');
const timesheetController = require('../controllers/timesheetController');

const router = express.Router();

// User routes
router.post('/login', userController.loginUser);
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// department routes
router.post('/department', departmentController.createDepartment);
router.get('/departments', departmentController.getAllDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.put('/department/:id', departmentController.updateDepartment);
router.delete('/department/:id', departmentController.deleteDepartment);

// timesheet routes
router.post('/timesheet', timesheetController.createTimesheet);
router.get('/timesheets', timesheetController.getAllTimesheets);
router.get('/timesheet/:id', timesheetController.getTimesheetById);
router.put('/timesheet/:id', timesheetController.updateTimesheet);
router.delete('/timesheet/:id', timesheetController.deleteTimesheet);

// project routes
router.post('/project', projectController.createProject);
router.post('/project/details', projectController.saveProjectDetails);
router.get('/projects', projectController.getAllProjects);
router.get('/project/:id', projectController.getProjectById);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);

// role routes
router.post('/role', roleController.createRole);
router.get('/roles', roleController.getAllRoles);
router.get('/role/:id', roleController.getRoleById);
router.put('/role/:id', roleController.updateRole);
router.delete('/role/:id', roleController.deleteRole);



module.exports = router;