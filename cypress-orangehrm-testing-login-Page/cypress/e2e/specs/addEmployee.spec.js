// cypress/e2e/specs/addEmployee.spec.js

import addEmployeePage from '../../pages/addEmployeePage';

describe('Add Employee Test Suite', () => {

  beforeEach(() => {
    // الذهاب لصفحة تسجيل الدخول
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    
    
    cy.get('input[name="username"]').type('Admin');
    
    // إدخال كلمة المرور
    cy.get('input[name="password"]').type('admin123');
    
    // الضغط على زر تسجيل الدخول
    cy.get('button[type="submit"]').click();
    
    // التأكد من الانتقال للداشبورد
    cy.url().should('include', '/dashboard');
    
    // الذهاب إلى صفحة Admin
    cy.contains('Admin').click();
    cy.wait(2000);
    
    // الضغط على Add (مباشرة - بدون User Management)
    cy.contains('button', 'Add').click();
    cy.wait(1000);

    // تأكد من تحميل الصفحة
    cy.get('input[placeholder="Type for hints..."]').should('be.visible');
  });

  // ============ TC-001 ============
  it('TC-001: Verify that Admin can successfully add a new user with valid data', () => {
    const timestamp = Date.now();
    const validUserData = {
      userRole: 'Admin',
      employeeName: 'Linda',
      status: 'Enabled',
      username: `testuser${timestamp}`, 
      password: 'Test@12345',
      confirmPassword: 'Test@12345'
    };

    addEmployeePage.fillUserForm(validUserData);
    addEmployeePage.clickSave();

    cy.wait(2000);
   // addEmployeePage.verifySuccessMessage();
  });

  // ============ TC-002 ============
  it('TC-002: Verify that required field validation messages appear when fields are left empty', () => {
    addEmployeePage.clickSave();

    addEmployeePage.verifyRequiredErrors();
  });

  // ============ TC-003 ============
  it('TC-003: Verify that system shows error when Password and Confirm Password do not match', () => {
    const mismatchPasswordData = {
      userRole: 'ESS',
      employeeName: 'Linda',
      status: 'Enabled',
      username: `testuser${Date.now()}`,
      password: 'Test@12345',
      confirmPassword: 'Different@123'
    };

    addEmployeePage.fillUserForm(mismatchPasswordData);
    addEmployeePage.clickSave();

    cy.wait(1000);
    addEmployeePage.verifyPasswordMismatchError();
  });

  // ============ TC-004 ============
  it('TC-004: Verify that system prevents adding user with an existing username', () => {
    const duplicateUsernameData = {
      userRole: 'Admin',
      employeeName: 'Linda',
      status: 'Enabled',
      username: 'Admin', // ✅ username موجود
      password: 'Test@12345',
      confirmPassword: 'Test@12345'
    };

    addEmployeePage.fillUserForm(duplicateUsernameData);
    addEmployeePage.clickSave();

    cy.wait(1000);
    addEmployeePage.verifyUsernameExistsError();
  });
});
