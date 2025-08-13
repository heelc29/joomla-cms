describe('Test in backend that the menu form', () => {
  beforeEach(() => cy.doAdministratorLogin());
  afterEach(() => cy.task('queryDB', "DELETE FROM #__menu_types WHERE menutype LIKE 'test-%-menu'"));

  it('can create a new site menu', () => {
    cy.visit('/administrator/index.php?option=com_menus&view=menus&filter=&client_id=0');
    cy.get('#client_id option:selected').should('have.text', 'Site');
    cy.visit('/administrator/index.php?option=com_menus&task=menu.add');
    cy.get('h1.page-title').should('contain.text', 'Menus: Add');

    cy.get('#jform_title').clear().type('test site menu');
    cy.get('#jform_menutype').clear().type('test-site-menu');
    cy.get('#jform_menudescription').clear().type('test site menu description');
    cy.get('#jform_preset').should('not.exist');
    cy.clickToolbarButton('Save & Close');

    cy.checkForSystemMessage('Menu saved');
    cy.contains('test site menu description');
  });

  it('can create a new administrator menu', () => {
    cy.visit('/administrator/index.php?option=com_menus&view=menus&filter=&client_id=1');
    cy.get('#client_id option:selected').should('have.text', 'Administrator');
    cy.visit('/administrator/index.php?option=com_menus&task=menu.add');
    cy.get('h1.page-title').should('contain.text', 'Menus: Add');

    cy.get('#jform_title').type('test admin menu');
    cy.get('#jform_menutype').type('test-admin-menu');
    cy.get('#jform_menudescription').type('test admin menu description');
    cy.get('#jform_preset').should('exist');
    cy.clickToolbarButton('Save & Close');

    cy.checkForSystemMessage('Menu saved');
    cy.contains('test admin menu description');
  });
});
