import { MorpheusPage } from './app.po';

describe('morpheus App', () => {
  let page: MorpheusPage;

  beforeEach(() => {
    page = new MorpheusPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
