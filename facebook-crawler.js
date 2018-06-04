// Gambiarra para fazer o "Download" de uma string.
download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

downloadPosts = async (filename, posts) => {
  downloadString = "";
  for (var id in posts) {
    // Seleciona Conteúdo dos posts
    content = (y => 
      y(
        getContent => 
          elem => {
            if(elem.attributes != undefined)
              if(elem.attributes["class"] != undefined)
                if(elem.attributes["class"].nodeValue.includes("userContent ")) return elem;
            ret = null;
            for (let item of elem.childNodes) {
              ret2 = getContent(item);
              if (ret2 != undefined) {
                ret = ret2;
                break;
              }
            }
            return ret;
          }
      )(posts[id])
    )(le => 
      (f => 
        f(f)
      )(f => 
        le(x => (f(f))(x))
      )
    );
    if (content != null) {
      (y => 
        y(
          getContent => 
            elem => {
              if(elem.localName == "p") downloadString = downloadString + "\n" + elem.textContent + ".";
              for (let item of elem.childNodes) {
                getContent(item);
              }
            }
        )(content)
      )(le => 
        (f => 
          f(f)
        )(f => 
          le(x => (f(f))(x))
        )
      );
    }
  }
  download(filename + "-sample.txt", downloadString);
}

// Melhor prática para "sleep" de acordo com https://stackoverflow.com/a/39914235/6501050
sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main = async (targetName, targetPostsLength) => {
  targetPosts = {};
  // Espera pelo menos targetPostsLength posts para fazer o download
  while (Object.keys(targetPosts).length < targetPostsLength) {
    // Seleciona os divs da hierarquia do DOM responsáveis pelos posts
    posts = document.querySelectorAll('div[id^=mall_post]')
    for (let post of posts) {
      // Seleciona nome do autor do post
      name = (y => 
        y(
          getName => 
            elem => {
              if(elem.attributes != undefined)
                if(elem.attributes["class"] != undefined)
                  if(elem.attributes["class"].nodeValue === "profileLink") return elem.innerHTML;
              ret = null;
              for (let item of elem.childNodes) {
                ret2 = getName(item);
                if (ret2 != undefined) {
                  ret = ret2;
                  break;
                }
              }
              return ret;
            }
        )(post)
      )(le => 
        (f => 
          f(f)
        )(f => 
          le(x => (f(f))(x))
        )
      );
      if(name == targetName) {
        // Salva post sem repetir
        targetPosts[post.attributes["id"].nodeValue] = post;
      }
    }
    // Navega até o fim da página
    if(Object.keys(targetPosts).length < targetPostsLength)
      window.scrollTo(0, document.body.scrollHeight);
    // Espera 2 segundos para novos posts carregarem
    await sleep(2000);
  }
  // Faz download dos posts selecionados
  downloadPosts(targetName, targetPosts);
}

main("Níckolas Alves", 30);