describe('Test in backend that the menu list', () => {
  beforeEach(() => {
    cy.doAdministratorLogin();
    cy.visit('/administrator/index.php?option=com_menus&view=menus&filter=');
  });
  afterEach(() => cy.task('queryDB', "DELETE FROM #__modules WHERE module = 'mod_menu' AND title LIKE 'Test % Menu Module'"));

  it('has a title', () => cy.get('h1.page-title').should('contain.text', 'Menus'));

  it('can display a list of menus', () => cy.contains('Main Menu'));

  it('can open the menu form', () => {
    cy.clickToolbarButton('New');

    cy.contains('Menus: Add');
  });

  it('can create a module to display the site menu', () => {
    cy.get('#client_id').select('Site');
    cy.db_createMenuType({ title: 'Test Site Menu', client_id: 0 });
    cy.reload();

    cy.get('table#menuList')
      .contains('Test Site Menu')
      .parents('tr')
      .find('button.btn.btn-sm.btn-primary')
      .should('contain.text', 'Add a module for this menu')
      .click();

    cy.get('joomla-dialog[type="iframe"]').as('dialogContent');
    cy.get('@dialogContent').should('be.visible');
    cy.get('@dialogContent').within(() => {
      cy.get('header.joomla-dialog-header').should('contain', 'Add a module for this menu');
      cy.get('section.joomla-dialog-body iframe').iframe().within(() => {
        cy.get('#jform_title').clear().type('Test Site Menu Module');
        cy.selectOptionInFancySelect('#jform_position', 'sidebar-right');
        cy.get('#toolbar-save').click();
      });
    });
    cy.get('@dialogContent').should('not.exist');

    cy.get('table#menuList').contains('Test Site Menu').parents('tr').as('listRow');
    cy.get('@listRow').find('button.btn.btn-sm.btn-secondary.dropdown-toggle').should('contain.text', 'Modules').click()
    cy.get('@listRow').contains('Test Site Menu Module').should('be.visible');
  });

  it('can create a module to display the administrator menu', () => {
    cy.get('#client_id').select('Administrator');
    cy.db_createMenuType({ title: 'Test Admin Menu', client_id: 1 });
    cy.reload();

    cy.get('table#menuList')
      .contains('Test Admin Menu')
      .parents('tr')
      .find('button.btn.btn-sm.btn-primary')
      .should('contain.text', 'Add a module for this menu')
      .click();

    cy.get('joomla-dialog[type="iframe"]').as('dialogContent');
    cy.get('@dialogContent').should('be.visible');
    cy.get('@dialogContent').within(() => {
      cy.get('header.joomla-dialog-header').should('contain', 'Add a module for this menu');
      cy.get('section.joomla-dialog-body iframe').iframe().within(() => {
        cy.get('#jform_title').clear().type('Test Admin Menu Module');
        cy.selectOptionInFancySelect('#jform_position', 'menu');
        cy.get('#toolbar-save').click();
      });
    });
    cy.get('@dialogContent').should('not.exist');

    cy.get('table#menuList').contains('Test Admin Menu').parents('tr').as('listRow');
    cy.get('@listRow').find('button.btn.btn-sm.btn-secondary.dropdown-toggle').should('contain.text', 'Modules').click()
    cy.get('@listRow').contains('Test Admin Menu Module').should('be.visible');
  });

  it('can delete the created site menu', () => {
    cy.get('#client_id').select('Site');

    cy.get('table#menuList')
      .contains('Test Site Menu')
      .parents('tr')
      .find('input[type="checkbox"]')
      .check();
    cy.clickToolbarButton('Delete');

    cy.get('body').then(($body) => {
      if ($body.find('div.buttons-holder button[data-button-ok]').length > 0) {
        cy.get('div.buttons-holder button[data-button-ok]').click();
      }
    });

    cy.get('.alert-message').should('contain.text', 'Menu deleted');
  });

  it('can delete the created administrator menu', () => {
    cy.get('#client_id').select('Administrator');

    cy.get('table#menuList')
      .contains('Test Admin Menu')
      .parents('tr')
      .find('input[type="checkbox"]')
      .check();

    cy.clickToolbarButton('Delete');

    cy.get('body').then(($body) => {
      if ($body.find('div.buttons-holder button[data-button-ok]').length > 0) {
        cy.get('div.buttons-holder button[data-button-ok]').click();
      }
    });

    cy.get('.alert-message').should('contain.text', 'Menu deleted');
  });
});
