import { ImsClientPage } from './app.po';

describe('ims-client App', () => {
  let page: ImsClientPage;

  beforeEach(() => {
    page = new ImsClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
