from django.shortcuts import render

from django.views import View

from django.http.response import JsonResponse
from django.template.loader import render_to_string


from .models import Topic
from .forms import TopicForm,TopicFirstForm


import time 

class IndexView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.order_by("-dt")
        context = { "topics":topics }

        return render(request,"bbs/index.html",context)

    def post(self, request, *args, **kwargs):

        # 後にJsonResponseで返却する辞書型
        data    = {"error":True}

        form    = TopicForm(request.POST)

        if not form.is_valid():
            print(form.errors)

            return JsonResponse(data)

        form.save()

        #更新箇所のレンダリング結果を文字列にしてJSONでレスポンスを返す
        context             = {}
        context["topics"]   = Topic.objects.order_by("-dt")

        data["error"]   = False

        #render_to_stringはレンダリング結果を文字列にして返す
        data["content"] = render_to_string("bbs/content.html",context,request)

        return JsonResponse(data)



index   = IndexView.as_view()



class RefreshView(View):

    def get(self, request, *args, **kwargs):

        data    = {"error":True}
        context = {}

        form    = TopicFirstForm(request.GET)

        first   = None
        if form.is_valid():
            cleaned = form.clean()
            first   = cleaned["first"]


        #TODO:ここで最新のデータに変更があるかどうかチェックする。
        for i in range(30):

            time.sleep(1)
            topic   = Topic.objects.order_by("-dt").first()

            #以降はtopicが存在することを前提とするため、存在しない場合は次のループへ
            if not topic:
                #print("データなし")
                continue

            #トピックが存在し、なおかつ送られたファーストデータは空。
            if not first:
                #print("あああ")
                break

            #トピックのidと送られたファーストデータが異なる
            if topic.id != first:
                #print("更新された")
                break

        context["topics"]   = Topic.objects.order_by("-dt")

        data["error"]   = False
        data["content"] = render_to_string("bbs/content.html",context,request)

        return JsonResponse(data)


refresh = RefreshView.as_view()


