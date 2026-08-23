(function () {
  var input = document.getElementById("search-input");
  var resultsEl = document.getElementById("search-results");
  var emptyEl = document.getElementById("search-empty");
  if (!input || !resultsEl) return;

  var indexUrl = document.currentScript.getAttribute("data-index");
  var items = [];
  var loaded = false;

  function load() {
    if (loaded) return Promise.resolve();
    return fetch(indexUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) { items = data; loaded = true; })
      .catch(function () { items = []; loaded = true; });
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter(function (item) {
      var haystack = [
        item.title, item.summary,
        (item.tags || []).join(" "),
        (item.categories || []).join(" ")
      ].join(" ").toLowerCase();
      return haystack.indexOf(q) !== -1;
    }).slice(0, 30);
  }

  function render(matches, query) {
    resultsEl.innerHTML = "";
    if (!query) { emptyEl.hidden = true; return; }
    if (matches.length === 0) { emptyEl.hidden = false; return; }
    emptyEl.hidden = true;
    matches.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.url;
      a.className = "search-result-title";
      a.textContent = item.title;
      var p = document.createElement("p");
      p.className = "search-result-summary";
      p.textContent = item.summary;
      li.appendChild(a);
      li.appendChild(p);
      resultsEl.appendChild(li);
    });
  }

  var timer;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    var value = input.value;
    timer = setTimeout(function () {
      load().then(function () { render(search(value), value.trim()); });
    }, 120);
  });

  var initial = new URLSearchParams(window.location.search).get("q");
  if (initial) {
    input.value = initial;
    load().then(function () { render(search(initial), initial); });
  }
})();
