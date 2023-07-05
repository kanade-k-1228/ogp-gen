const path = require("node:path");
const sharp = require("sharp");
const TextToSVG = require("text-to-svg");
const textToSVG = TextToSVG.loadSync("./assets/NotoSansJP-Bold.ttf");

const WIDTH = 1200;
const TITLE_AREA = { begin: 30, end: 480 };

/**
 *
 * @param {string[]} title
 * @returns
 */
const textToSvg = (title) => {
  const options = {
    x: 0,
    y: 0,
    fontSize: 68,
    anchor: "left top",
    attributes: { fill: "black" },
  };
  const svg = textToSVG.getSVG(title, options);
  const metrics = textToSVG.getMetrics(title, options);
  return { svg, metrics };
};

const setPlace = (data) => {
  const n = data.length;
  const dy = Math.floor((TITLE_AREA.end - TITLE_AREA.begin) / (n + 1));
  return data.map(({ svg, metrics }, i) => {
    const x = Math.floor(WIDTH / 2 - metrics.width / 2);
    const y = TITLE_AREA.begin + dy * (i + 1) - Math.floor(metrics.height / 2);
    return { svg, x, y };
  });
};

const generateOgp = async (texts) => {
  const svgs = texts.map((t) => textToSvg(t));
  const placed = setPlace(svgs);
  await sharp(path.resolve("assets/ogp.png"))
    .composite(
      placed.map(({ svg, x, y }) => ({
        input: Buffer.from(svg),
        left: x,
        top: y,
      }))
    )
    .toFile(path.resolve("out/ogp.png"));
};

generateOgp(["Kanadeのサイトへ", "ようこそ！"]);
