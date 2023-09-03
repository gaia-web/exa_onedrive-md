import { html, render } from "lit-html";
import { OneDriveAdapter, OneDriveFile } from "drive-adapters";
import { marked } from "marked";

const appContainer = document.querySelector<HTMLDivElement>("#app");

const sharingLink = `https://1drv.ms/f/s!Akwk_rooMFtbgRZsFanDS-fleX-m?e=1jz0gf`;
const driveAdapter = new OneDriveAdapter(sharingLink);

const fileList: OneDriveFile[] = [];
let markdown: string;

async function init() {
  const files = await driveAdapter.children;
  if (!files) return;
  for await (let file of files) {
    if (file.name?.endsWith(".md")) fileList.push(file as OneDriveFile);
  }
  await update();
}

const htmlTemplate = () => html`
  <h1>List</h1>
  <ul>
    ${fileList.map(
      (file) => html`
        <li
          style="cursor: pointer"
          @click=${async () => {
            markdown = (await file.contentAsText) ?? "";
            update();
          }}
        >
          <b>${file.name}</b> - ${file.createdTime}
        </li>
      `
    )}
  </ul>
  <hr />
  <h1>Content</h1>
  <div
    .innerHTML=${marked(markdown ?? "")}
    style="font-family: arial; border: 1px solid black; padding: 2rem;"
  ></div>
`;

function update() {
  render(htmlTemplate(), appContainer ?? document.body);
}

init();
