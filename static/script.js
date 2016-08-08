function update_tab(elem, name) {
  var cells = document.getElementsByClassName("individual");
  for (var i = 0; i < cells.length; i++) {
    cells[i].className = "individual";
  }

  elem.className = "individual selected";

  iframe = document.getElementsByTagName("iframe")[0];
  iframe.src = "tab.html?name=" + name;
}
