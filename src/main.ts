import { html, render } from "lit-html";
import { OneDriveAdapter, OneDriveFile } from "drive-adapters";
import '@awesome-elements/markdown'

const appContainer = document.querySelector<HTMLDivElement>("#app");

// use the sharing link to create a drive adapter
const sharingLink = `https://1drv.ms/f/s!Akwk_rooMFtbgRZsFanDS-fleX-m?e=1jz0gf`;
const driveAdapter = new OneDriveAdapter(sharingLink);

// consider them as states
let mdList: OneDriveFile[];
let markdown: string;

// this is the HTML template to be rendered
const htmlTemplate = () => html`
  <h1>List (clickable)</h1>
  <ul>
    ${mdList.map(
  (file) => html`
        <li
          style="cursor: pointer"
          @click=${async () => {
      // obtain file content as text and assign it to markdown state
      markdown = (await file.contentAsText) ?? "";
      // calling update() to rerender
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
  <awesome-markdown .markdown=${markdown}>
    <style>
      ::part(container) {
        font-family: arial; border: 1px solid black; padding: 2rem;
      }
    </style>
  </awesome-markdown>
`;

// calling this function to update UI (rerender the HTML template)
function update() {
  render(htmlTemplate(), appContainer ?? document.body);
}

// initialization function
async function init() {
  // refresh mdList
  mdList = [];
  // get children of the root directory
  const children = await driveAdapter.children;
  if (!children) return;
  for await (let child of children) {
    // if the child item has name ending with ".md", then push it into mdList
    if (child.name?.endsWith(".md")) mdList.push(child as OneDriveFile);
  }
  // call update() to rerender
  await update();
}

// start logic
init();
