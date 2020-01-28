describe('sample test', function () {
  it('should work', async function () {
    console.log(await browser.version());

    expect(true).to.be.true;
  });

  it('should have the correct page title', async () => {
    expect(await page.title()).to.eql('SimpleUJS Testing Page');
  });
});
