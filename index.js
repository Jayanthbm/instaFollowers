import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');
const { JSDOM } = require("jsdom");
import chalk from 'chalk';
import ora from 'ora';
(async () => {
  var result = [];
  let browser;
  browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
  });
  const url = [
    'https://www.instagram.com/jayanthbharadwaj/',
    'https://www.instagram.com/virat.kohli/',
    'https://www.instagram.com/gaddigeshgaddu7/',
    'https://www.instagram.com/monika_bg_smg/',
    'https://www.instagram.com/_.archana/',
    'https://www.instagram.com/anuragandikote/',
    'https://www.instagram.com/kish.12/',
    'https://www.instagram.com/_s_u_r_a_j_p_u_j_a_r_/',
    'https://www.instagram.com/sapthami_gowda/',
    'https://www.instagram.com/govindjamkhandi/',
    'https://www.instagram.com/fairoz__faizu/'
  ];
  const spinner = ora().start();
  const spinner2 = ora('Loading').start();
  spinner.info('Logging into Instagram..')
  let page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
  await page.type('input[name=username]', '7019883952');
  await page.type('input[name=password]', 'jbot@123');
  await page.click("button[type=submit]");
  try {
    await page.waitForNavigation({ timeout: '10000' });
    spinner.succeed('Login Successful')
  } catch (error) {
    spinner.warn("Error During Login, Trying to fetch followers without login");
  }
  for (let i = 0; i < url.length; i++) {
    await page.goto(url[i], { waitUntil: 'networkidle2' });
    var html = await page.content();
    var { document } = new JSDOM(html).window;
    try {
      var header = document.getElementsByTagName('header');
      var section = header[0].getElementsByTagName('section');
      var name = section[0].getElementsByClassName('_aa_c')[0].childNodes[0].innerHTML;
      var followersExactNumber = section[0].getElementsByTagName('ul')[0].childNodes[1].getElementsByClassName('_ac2a')[0].title
      var followersReadable = section[0].getElementsByTagName('ul')[0].childNodes[1].getElementsByClassName('_ac2a')[0].innerHTML
      var followingCount = section[0].getElementsByTagName('ul')[0].childNodes[2].getElementsByClassName('_ac2a')[0].innerHTML;
      followersExactNumber = followersExactNumber.replaceAll(',', '');
      result.push({
        name,
        followers1: parseInt(followersExactNumber),
        followers2: followersReadable,
        following: followingCount
      });
      spinner.succeed(`Fetched ${name}`);
    } catch (error) {
      spinner.fail(url[i])
    }
  }
  browser.close();
  if (result?.length > 0) {
    result.sort((a, b) => b.followers1 - a.followers1);
    for (let i = 0; i < result.length; i++) {
      let name = result[i].name;
      let followers = result[i].followers1;
      if (followers > 99999) {
        followers = result[i].followers2;
      }
      let following = result[i].following;
      console.log(chalk.blue.bgRed.bold(i + 1) + ' ' + chalk.blue(name) + chalk.magenta(' --> ') + chalk.hex('#DEADED').bold(followers))
  }
  } else {
    spinner.fail('Fetching Failed');
  }
  spinner.stop()
  spinner2.stop()
})();