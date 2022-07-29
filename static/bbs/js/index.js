//ページが読み込まれた時に以下の内容を実行する
//有名関数で指定
/*
window.addEventListener("load" , eventlisten );
function eventlisten(){
    $("#submit").on("click", function(){ submit(); });
}
*/

//無名関数(関数を定義せずに、関数を割り当てる)
window.addEventListener("load" , function (){

    //id="submit"に対してイベントリスナをセットする
    $("#submit").on("click", function(){ submit(); });
    //↑と↓は等価
    //$("#submit").on("click", submit );


    //setIntervalもしくはsetTimeoutを使って、一定時間おきにrefreshを実行する。
    //setInterval 指定したミリ秒だけ待って何回でも実行する
    //setInterval(refresh, 1000);

    //ロングポーリングの場合、Ajaxが終わってから再度送信を行うため、setIntervalではなくsetTimeoutを使う。
    refresh();

});

function submit(){

    let form_elem   = "#form_area";

    //Ajaxで送信するため、FormDataのオブジェクトを作る(これでビューのコードを書き換える必要が無くなる。)
    let data    = new FormData( $(form_elem).get(0) ); // $(form_elem)だとイテラブルな形なので、中身を1つ取る。

    let url     = $(form_elem).prop("action"); //id="form_area"のaction属性の値を取り出す
    let method  = $(form_elem).prop("method"); //id="form_area"のmethod属性の値を取り出す


    //送信するデータの確認
    //for (let v of data ){ console.log(v); }
    //for (let v of data.entries() ){ console.log(v); }

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json' //レスポンスをjsonで返す
    }).done( function(data, status, xhr ) { 

        // doneの引数について詳細
        // https://qiita.com/otsukayuhi/items/31ee9a761ce3b978c87a

        if (data.error){
            //Djangoのビューでバリデーションエラーの時
            console.log("ERROR");
        }
        else{
            //処理結果(data.content)をid="content_area"に貼り付ける
            $("#content_area").html(data.content);
            $("#textarea").val("");
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 

    //$ajax( {引数} ).done( function(){ Ajaxによるリクエストが成功したときの処理 } ).fail( function(){ 失敗した時の処理} )
}

function refresh(){

    //ここで最新の投稿内容のIDを取得。クエリストリングを作る
    // ?first=1
    let param   = "?" + $("#first").prop("name") + "=" + $("#first").val();
    //console.log(param);

    $.ajax({
        url: "refresh/" + param ,
        type: "GET",
        dataType: 'json' //レスポンスをjsonで返す
    }).done( function(data, status, xhr ) { 

        if (!data.error){
            $("#content_area").html(data.content);
        }

    }).fail( function(xhr, status, error) {
        //表示させるエラーがある時だけ表示
        if (error){
            console.log(status + ":" + error );
        }
    }).always( function(){

        //このAjaxが終了次第、一定時間待って再実行する。
        setTimeout(refresh , 500);
        
    }); 
}

