/**
 * Builds app/favicon.ico from app/apple-icon.png (multi-resolution for tabs / Windows).
 * Run: npm run generate:favicon
 */
const fs = require("fs");
const path = require("path");

const sharp = require("sharp");
const toIco = require("to-ico");

const root = path.join(__dirname, "..");
const input = path.join(root, "app", "apple-icon.png");
const output = path.join(root, "app", "favicon.ico");

const sizes = [16, 32, 48, 64];

(async () => {
  const source = fs.readFileSync(input);
  const pngs = await Promise.all(
    sizes.map((size) =>
      sharp(source)
        .resize(size, size, { fit: "cover" })
        .png()
        .toBuffer(),
    ),
  );
  const ico = await toIco(pngs);
  fs.writeFileSync(output, ico);
  console.log(`Wrote ${output} (${ico.length} bytes, ${sizes.join("/")} px)`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
