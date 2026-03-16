var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/video.js
  function parse(element, { document }) {
    const desktopHero = element.querySelector(".hero-video.d-sm-block") || element.querySelector(".hero-video");
    if (!desktopHero) return;
    const videos = desktopHero.querySelectorAll("video");
    let loopVideo = null;
    for (const v of videos) {
      const src = v.querySelector("source");
      if (src && src.getAttribute("src") && src.getAttribute("src").includes("loop")) {
        loopVideo = v;
        break;
      }
    }
    if (!loopVideo && videos.length > 1) loopVideo = videos[1];
    if (!loopVideo && videos.length > 0) loopVideo = videos[0];
    const heading = desktopHero.querySelector(".heading, h1, h2");
    const ctaLinks = Array.from(desktopHero.querySelectorAll(".buttons a, a.btn-main, a.btn-second"));
    const cells = [];
    if (loopVideo) {
      cells.push([loopVideo]);
    }
    if (heading) {
      cells.push([heading]);
    }
    if (ctaLinks.length > 0) {
      cells.push(ctaLinks);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const halfBlocks = element.querySelectorAll(".half-block");
    if (!halfBlocks || halfBlocks.length === 0) return;
    const columnCells = [];
    halfBlocks.forEach((block2) => {
      const cellContent = [];
      const heading = block2.querySelector("h2, h3, h1");
      if (heading) cellContent.push(heading);
      const para = block2.querySelector("p");
      if (para) {
        const inlineImgs = para.querySelectorAll("img");
        inlineImgs.forEach((img) => img.remove());
        cellContent.push(para);
      }
      const cta = block2.querySelector('a.btn-second, a.btn-third, a.btn-main, a[class*="btn"]');
      if (cta) cellContent.push(cta);
      const allImgs = block2.querySelectorAll("img");
      for (const img of allImgs) {
        if (img.closest("p") || img.closest("h2") || img.closest("h3")) continue;
        const dataSrc = img.getAttribute("data-src") || img.getAttribute("data-lazy-src") || img.getAttribute("data-original");
        if (dataSrc) {
          img.setAttribute("src", dataSrc);
        }
        const src = img.getAttribute("src") || "";
        if (src && !src.startsWith("data:")) {
          cellContent.push(img);
          break;
        }
      }
      columnCells.push(cellContent);
    });
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cardWraps = element.querySelectorAll(".news-wrap");
    if (!cardWraps || cardWraps.length === 0) return;
    const cells = [];
    cardWraps.forEach((card) => {
      const img = card.querySelector(".image-wrap img, img");
      if (img) {
        const dataSrc = img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
        if (dataSrc) {
          img.setAttribute("src", dataSrc);
        }
      }
      const textContent = [];
      const title = card.querySelector("h3");
      if (title) textContent.push(title);
      const description = card.querySelector("p");
      if (description) textContent.push(description);
      const readMore = card.querySelector("a.read-more");
      if (readMore) textContent.push(readMore);
      const row = [];
      if (img) row.push(img);
      row.push(textContent);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".accordion-item");
    if (!items || items.length === 0) return;
    const cells = [];
    items.forEach((item) => {
      const question = item.querySelector(".accordion-header h2, .accordion-header h3, .accordion-button h2");
      const answerBody = item.querySelector(".accordion-body");
      const row = [];
      if (question) row.push(question);
      if (answerBody) row.push(answerBody);
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/zonnic-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ["noscript", '[id*="cookie"]', '[class*="cookie"]', '[id*="consent"]']);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        ".side-menu",
        "footer",
        ".kop-zonnic",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/zonnic-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "video": parse,
    "columns": parse2,
    "cards": parse3,
    "accordion": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Zonnic homepage with hero video sections, product columns, information cards, and FAQ accordion",
    urls: [
      "https://www.zonnic.com"
    ],
    blocks: [
      {
        name: "video",
        instances: [".hero-section#hero-1", ".hero-section#hero-2"]
      },
      {
        name: "columns",
        instances: [".half-blocks"]
      },
      {
        name: "cards",
        instances: [".news-section .news-row"]
      },
      {
        name: "accordion",
        instances: [".faq-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Video Hero - Pouches",
        selector: ".hero-section#hero-1",
        style: null,
        blocks: ["video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Video Hero - Spray",
        selector: ".hero-section#hero-2",
        style: null,
        blocks: ["video"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Product Information Columns",
        selector: ".half-blocks",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Information Cards",
        selector: ".news-section",
        style: null,
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "FAQ Accordion",
        selector: ".faq-section",
        style: "light-grey",
        blocks: ["accordion"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
