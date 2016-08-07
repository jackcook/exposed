function update_tab(name) {
  iframe = document.getElementsByTagName("iframe")[0];
  iframe.src = "tab.html?name=" + name;
}
