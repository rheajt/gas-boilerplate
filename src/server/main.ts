import { sum } from "./sum";

export const hello = () => {
    console.log("hello world", sum(1, 2));
};

export const openSidebar = () => {
    const html =
        HtmlService.createHtmlOutputFromFile("sidebar").setTitle("Sidebar");
    SpreadsheetApp.getUi().showSidebar(html);
};
