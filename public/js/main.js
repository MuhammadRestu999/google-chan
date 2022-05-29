function isURL(text) {
  let url;
  try {
    url = new URL(text);
  } catch(_) {
    return false;
  };
  return url.protocol == "http:" || url.protocol == "https:";
}

function nav(type) {
  let bookmark = document.querySelectorAll("div#bookmarks > div");
  if(type === 1) {
    document.getElementById("mySidenav").style.width = "250px";
    bookmark.forEach(v => v.setAttribute("class", v.getAttribute("class") + " hidden"));
  } else {
    document.getElementById("mySidenav").style.width = "0";
    bookmark.forEach(v => v.setAttribute("class", v.getAttribute("class").replace(" hidden", "")));
  };
}

function change() {
  let isLight = localStorage["theme"] == "light";
  if(isLight) {
    localStorage["theme"] = "dark";
    document.body.setAttribute("class", "dark");
    document.querySelector("a.closebtn").click();
    document.querySelector("#themeIcon > img").setAttribute("src", "/image/btn-light.svg");
    document.querySelector("div.sidenav").setAttribute("style", "background-color: #000000;color: #ffffff;");
    document.querySelector("#textIcon > span").innerHTML = "Dark Theme";
  } else {
    localStorage["theme"] = "light";
    document.body.setAttribute("class", "light");
    document.querySelector("a.closebtn").click();
    document.querySelector("#themeIcon > img").setAttribute("src", "/image/btn-dark.svg");
    document.querySelector("div.sidenav").setAttribute("style", "background-color: #bdbdbd;color: #000000;");
    document.querySelector("#textIcon > span").innerHTML = "Light Theme";
  };
}

function setImg(file) {
  document.getElementById("image").setAttribute("src", "/image/" + file);
  localStorage["img"] = file;
}

function addBookmark(title, url) {
  let bookmark = localStorage["bookmark"]?.replace ? JSON.parse(localStorage["bookmark"]) : [];
  let tmp = []
  let html = `        <div class="flex flex-col justify-center items-center my-5 transition duration-150 hover:scale-110">
          <a class="flex w-full bg-white !w-[64px] !h-[64px] justify-center items-center mb-1 rounded-full hover:bg-opacity-60 dark:bg-[#232323] bg-opacity-90" href="${url}" target="_blank" rel="noopener noreferrer" title="">
            <span class="object-cover flex justify-center items-center h-[32px] w-[32px] bg-[#faefff] rounded dark:bg-[#3B3B3B]">
              <img src="${'https://s2.googleusercontent.com/s2/favicons?domain='+(url != '#' ? url : 'https://example.com/')}" width="16" height="16" alt="">
            </span>
          </a>
          <div class="text-center whitespace-nowrap cursor-help black-selene group relative">
            <span class="truncate">${title}</span>
          </div>
        </div>`;
  for(let i in bookmark) i != bookmark.length - 1 ? tmp.push(bookmark[i]) : false;
  tmp.push(html);
  tmp.push(bookmark[bookmark.length-1]);
  localStorage["bookmark"] = JSON.stringify(tmp);
  document.querySelector("div#bookmarks").innerHTML = tmp.join("\n");
  return tmp.includes(html);
}

async function showPrompt(type) {
  if(type == "ab") {
    Swal.fire({
      title: "Add a new bookmark",
      icon: "question",
      html: `<br><span>Name <input type="text" name="name" style="color: #000000;" required></span><br><span>URL <input type="url" name="url" style="color: #000000;" required></span>`,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      showCancelButton: true
    }).then(({ isConfirmed: ic }) => {
      let name = Swal.getHtmlContainer().querySelector("input[name=name]")?.value;
      let url = Swal.getHtmlContainer().querySelector("input[name=url]")?.value;
      let notUrl = !isURL(url);
      let cancel = !ic || !name || !url || notUrl;
      if(cancel) {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: `Adding bookmark canceled ${!ic ? "by user" : !name ? "because name is empty" : !url ? "because URL is empty" : notUrl ? "the user did not enter a valid URL" : "null"}`
        });
        return false;
      };
      if(addBookmark(name, url)) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Successfully added bookmarks"
        });
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Unable to add bookmarks!"
        });
      };
    });
  } else if(type == "db") {
    let bookmark = JSON.parse(localStorage["bookmark"])
    let inputOptions = {}
    for(let i of bookmark) {
      let name = i.split("truncate\">")[1].split("<")[0];
      if(name == "Add Bookmark") continue;
      inputOptions[name] = i;
    }
    let { value, isConfirmed } = await Swal.fire({
      title: "Delete bookmarks",
      icon: "question",
      input: "select",
      inputOptions,
      inputPlaceholder: "Select a bookmark to delete",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if(!value || value.length <= 0 || value == "") {
            resolve("Please select a bookmark");
          } else {
            resolve();
          };
        });
      }
    });
    if(!isConfirmed) return Swal.fire({
      title: "Failed",
      icon: "error",
      text: "Canceled by user"
    });
    let found = bookmark.filter((v, w) => v.includes(value))[0];
    let tmp = [];
    for(let i of bookmark) i != found ? tmp.push(i) : false;
    if(!tmp.includes(found)) {
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Successfully delete bookmarks"
      });
      localStorage["bookmark"] = JSON.stringify(tmp);
      document.querySelector("div#bookmarks").innerHTML = tmp.join("\n");
    } else {
      Swal.fire({
        title: "failed",
        icon: "error",
        text: "Failed to delete bookmarks"
      });
    };
  };
}

function load() {
  if(!localStorage["theme"]) localStorage["theme"] = "light";
  if(!localStorage["img"]) localStorage["img"] = "google.png";
  if(!localStorage["bookmark"]) localStorage["bookmark"] = JSON.stringify([`        <div class="flex flex-col justify-center items-center my-5 transition duration-150 hover:scale-110">\n          <a class="flex w-full bg-white !w-[64px] !h-[64px] justify-center items-center mb-1 rounded-full hover:bg-opacity-60 dark:bg-[#232323] bg-opacity-90" href="javascript:void(0)" title="Add" onclick="showPrompt('ab')">\n            <span class="object-cover flex justify-center items-center h-[32px] w-[32px] bg-[#faefff] rounded dark:bg-[#3B3B3B]">\n              <span class="material-icons align-middle">add</span>\n            </span>\n          </a>\n          <div class="text-center whitespace-nowrap cursor-help black-selene group relative">\n            <span class="truncate">Add Bookmark</span>\n          </div>\n        </div>`]);
  document.querySelector("div#bookmarks").innerHTML = JSON.parse(localStorage["bookmark"]).join("\n");

  let isLight = localStorage["theme"] == "light";

  setImg(localStorage["img"]);
  if(isLight) {
    document.body.setAttribute("class", "light");
    document.querySelector("#themeIcon > img").setAttribute("src", "/image/btn-dark.svg");
    document.querySelector("div.sidenav").setAttribute("style", "background-color: #bdbdbd;color: #000000;");
    document.querySelector("#textIcon > span").innerHTML = "Light Theme";
  } else {
    document.body.setAttribute("class", "dark");
    document.querySelector("#themeIcon > img").setAttribute("src", "/image/btn-light.svg");
    document.querySelector("div.sidenav").setAttribute("style", "background-color: #000000;color: #ffffff;");
    document.querySelector("#textIcon > span").innerHTML = "Dark Theme";
  };
}
