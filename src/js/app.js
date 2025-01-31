/**************************************************************

***************************************************************/



const main = document.querySelector(".main");
const links = [...document.querySelectorAll("a")];
// console.log(links);
const transitionDiv = document.querySelector(".transition__div");

links.forEach(link => {
  link.addEventListener("click", async e => {
    e.preventDefault();
    const url = e.target.href; // 遷移先のurl取得
    // console.log(url);

    await startTransition(url);

    const pathName = new URL(url).pathname; // パスを取得。
    // console.log(pathName);/about

    // ⭐️ページリロードをせずに、ブラウザのアドレスバーに表示されているURLを変更する処理
    // → ブラウザの戻るボタンや進むボタン によって、この変更が反映された履歴を辿れるようになる
    // history → ブラウザの履歴
    // history.pushState(state, title, url);
    // state: 状態オブジェクト。
    //        遷移後のページに渡したい、保持したいデータを渡す
    //        ブラウザの履歴エントリに関連するデータを格納。
    //        null が指定されているので、特に状態データは設定されていない
    // title: ページのタイトル
    //        ほとんどのブラウザで無視されため、空文字("")を指定。
    //        タイトルは URL 変更だけで変わることはなく、JavaScript で変更する必要がある
    // url: 新しいURL
    //      ここではpathName には遷移先のページのパス部分（例：/about.html）が格納
    //      これを 現在のURLのドメイン部分を除いた 形で指定。
    //      これによって、URLが変更されるが、ページのリロードは起こらない
    history.pushState(null, "", pathName);
  })
});

// ブラウザの「戻る」「進む」ボタンが押されたときに、ページの遷移を制御するための処理
// posstate → history.replaceState()やpushState()で履歴が追加された後に、
//            ユーザーが「戻る」「進む」ボタンを押したときに発火 するイベント。
//            ⭐️注意: 通常の location.href = "..." や window.location.replace() などの 通常のページ遷移では発火しない
window.addEventListener("popstate", e => {
  const url = window.location.pathname;
  // console.log(url)
  startTransition(url);
})


// 遷移先のmainを取得して挿入、クラスを付与して遷移アニメーションを実現する処理
async function startTransition(_url) {
  const html = await fetch(_url); // ページデータを取得
  // console.log(html); // Response {type: 'basic', url: 'http://127.0.0.1:5500/about.html', redirected: false, status: 200, ok: true, …}

  // html.text() →　レスポンスデータを文字列として取得
  //                Promiseを返すので、awaitで待機、解決
  const htmlString = await html.text();
  // console.log(htmlString); // 遷移先のhtmlを全て取得(文字列)

  // DOMParser →　ここで文字列を実際のDOMに変換
  const parser = new DOMParser(); // 実際のHTML
  // console.log(parser); // DOMParser {}

  // console.log(parser.parseFromString(htmlString, "text/html")); // #document { http://127.0.0.1:5500/ }
  // → HTML Documentオブジェクト を取得
  const parsedHtml = parser.parseFromString(htmlString, "text/html").querySelector(".main");
  // console.log(parsedHtml); // 遷移先のhtmlを取得

  // ⭐️ここで、metaデータも他のページから抜き取り動的に書き換えていく

  // ⭐️逆にDOMを文字列にする方法 →　XMLSerializer api を使う
  // const serializer = new XMLSerializer();
  // const htm = serializer.serializeToString(parsedHtml);
  // console.log(htm);

  // ⭐️遷移アニメーションなしに即ページを切り替える方法
  main.innerHTML = parsedHtml.innerHTML;

  // ⭐️遷移アニメーションを付与する場合
  // main.classList.add("hidden"); // mainのopacityを0に
  // main.addEventListener("transitionend", () => {
  //   // → cssのtransitionが完了したタイミングで発火
  //   //   ⭐️cssでtransitionが設定されていて、しかも、必ず何かしらの要素がtransitionしないと発火しいない
  //   // console.log("transitionend");

  //   // 遷移先のmainのhtmlを挿入
  //   main.innerHTML = parsedHtml.innerHTML; 
  //   main.classList.remove("hidden");
  // }, { once: true });
  // { once: true }の意味
  // → mainにはcssプロパティが複数設定してあるので、そのプロパティ分イベントが発火してしまうのでこれを防ぐ
  //   spaでaタグをクリックした場合、preventDefaultをしても実際にはページ遷移の処理が内部的に実行されている状態。
  //   なのでメモリの解放と新しいDOMへの更新してやる

  // ⭐️遷移中に何かのアニメーションを入れる方法
  // transitionDiv.classList.add("animate__in");
  // transitionDiv.addEventListener("transitionend", () => {
  //   // →　cssのtransitionが終われば発火
  //   main.innerHTML = parsedHtml.innerHTML;
  //   transitionDiv.classList.remove("animate__in");
  //   transitionDiv.classList.add("animate__out");

  //   setTimeout(() => {
  //     // .animate__outを即消す
  //     transitionDiv.style.transition = "0s";
  //     transitionDiv.classList.remove("animate__out"); 

  //     setTimeout(() => {
  //       transitionDiv.style.transition = "1s"; // 元に戻す
  //     }, 100)
  //   }, 1000);
  // })
}