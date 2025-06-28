let page;

beforeEach(async () => {
  page = await browser.newPage();
  //await page.goto("https://github.com/team");
});

afterEach(() => {
  page.close();
});

describe("Github page tests", () => {

  beforeEach(async () => {
    await page.goto("https://github.com/team", { waitUntil: "networkidle2" });
  });
  // соответствие титула страницы
  test("The title content in team page.", async () => {  // название "The h1 header content" не подходит для данного теста
    const firstLink = await page.$("header div div a");
    await firstLink.click();
    await page.waitForSelector("h1");
    const title2 = await page.title();
    // expect(title2).toEqual("GitHub: Where the world builds software · GitHub"); - такого элемента нет
    
    expect(title2).toEqual(
      "GitHub · Build and ship software on a single, collaborative platform · GitHub"
    );
  }, 20000);
  
  // соответвие названия атрибута для первой ссылке
  test("The first link attribute", async () => {
    const actual = await page.$eval("a", (link) => link.getAttribute("href"));
    expect(actual).toEqual("#start-of-content");
  }, 10000);
 
  // наличие кнопки с заданным селектором
  test("The page contains Sign in button", async () => {
    const btnSelector = ".btn-large-mktg.btn-muted-mktg";  // ошибка в селекторе - ".btn-large-mktg.btn-mktg" отрабатывает по кнопке "Get started with Team"
    await page.waitForSelector(btnSelector, {
      visible: true,
    });
    const actual = await page.$eval(btnSelector, (link) => link.textContent);

    expect(actual).toContain("Sign up for free");

    await page.screenshot({ path: "img/Sign-in-button.png" });
  }, 10000);
});

// Содержание заголовка для тега 
test("The h1 header content in page pricing", async () => {
  await page.goto("https://github.com/pricing", { waitUntil: "networkidle2" });

  await page.waitForSelector("h1.h2-mktg");
  const text = await page.$eval("h1.h2-mktg", (element) => element.textContent);

  expect(text).toEqual("Try the Copilot-powered platform");

  await page.screenshot({ path: "img/h1-header-content-pricing-page.png" });
}, 20000);

// Содержание заголовка для тега 
test("The h1 header content in page features/issues", async () => {
  await page.goto("https://github.com/features/issues", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector("h1#hero-section-brand-heading"); 
  const text = await page.$eval(
    "h1#hero-section-brand-heading",
    (element) => element.textContent
  );
  expect(text).toEqual("Project planning for developers");
  await page.screenshot({
    path: "img/h1-header-content-features-issues-page.png",
  });
}, 20000);

// переход по кнопке для незарегистрированного пользователя
test("Should go to the Pick your trial plan purchase page for an unregistered user", async () => {
  await page.goto("https://github.com/solutions", {
    waitUntil: "networkidle2",
  });

  const btnSelector = ".Primer_Brand__Button-module__Button___lDruK";

  await page.waitForSelector(btnSelector, {
    visible: true,
  });

  const textButton = await page.$eval(
    btnSelector,
    (element) => element.textContent
  );

  expect(textButton).toEqual("Start a free trial");

  await page.click(btnSelector);
  await page.waitForNavigation();

  const actual = page.url();
  const expected =
    "https://github.com/organizations/enterprise_plan?ref_cta=Start+a+free+trial&ref_loc=hero&ref_page=%2Fsolutions_overview";

  expect(actual).toEqual(expected);

  await page.screenshot({
    path: "img/unregistered-user-should-go-to-purchase-page.png",
  });
}, 20000);