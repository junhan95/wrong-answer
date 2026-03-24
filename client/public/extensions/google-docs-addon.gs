/**
 * WiseQuery Google Docs Add-on
 *
 * 설치 방법:
 * 1. Google Docs에서 확장 프로그램 > Apps Script 를 클릭합니다.
 * 2. 이 코드를 붙여넣고 저장합니다.
 * 3. 페이지를 새로고침하면 메뉴에 "WiseQuery" 가 추가됩니다.
 */

const WISEQUERY_URL = "https://wisequery.app";

function onOpen() {
  DocumentApp.getUi()
    .createMenu("WiseQuery")
    .addItem("선택한 텍스트로 질문하기", "askWiseQuery")
    .addItem("문서 요약 요청", "summarizeDoc")
    .addSeparator()
    .addItem("WiseQuery 열기", "openWiseQuery")
    .addToUi();
}

function askWiseQuery() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();

  if (!selection) {
    DocumentApp.getUi().alert("텍스트를 선택한 후 다시 시도해주세요.");
    return;
  }

  const elements = selection.getRangeElements();
  let text = "";
  for (const el of elements) {
    text += el.getElement().asText().getText();
  }

  if (!text.trim()) {
    DocumentApp.getUi().alert("선택한 텍스트가 비어있습니다.");
    return;
  }

  const encoded = encodeURIComponent(text.trim().substring(0, 2000));
  const html = HtmlService.createHtmlOutput(
    `<script>window.open("${WISEQUERY_URL}/?q=${encoded}");google.script.host.close();</script>`
  ).setWidth(1).setHeight(1);

  DocumentApp.getUi().showModalDialog(html, "WiseQuery로 이동 중...");
}

function summarizeDoc() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody().getText();

  if (!body.trim()) {
    DocumentApp.getUi().alert("문서가 비어있습니다.");
    return;
  }

  const truncated = body.substring(0, 3000);
  const prompt = encodeURIComponent("다음 문서를 요약해주세요:\n\n" + truncated);
  const html = HtmlService.createHtmlOutput(
    `<script>window.open("${WISEQUERY_URL}/?q=${prompt}");google.script.host.close();</script>`
  ).setWidth(1).setHeight(1);

  DocumentApp.getUi().showModalDialog(html, "WiseQuery로 이동 중...");
}

function openWiseQuery() {
  const html = HtmlService.createHtmlOutput(
    `<script>window.open("${WISEQUERY_URL}");google.script.host.close();</script>`
  ).setWidth(1).setHeight(1);

  DocumentApp.getUi().showModalDialog(html, "WiseQuery 열기");
}
