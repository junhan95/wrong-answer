import { useAuth } from "@/hooks/useAuth";
import { MobileLayout } from "@/components/layout/mobile-layout";
import { Flame, ChevronRight, BookOpen, Clock, AlertCircle } from "lucide-react";
import { useDueReviews, useWrongAnswers } from "@/hooks/use-wrong-answers";

export default function Home() {
  const { user } = useAuth();
  const { dueReviews, isLoading: isLoadingReviews } = useDueReviews(5);
  const { wrongAnswers, isLoading: isLoadingWrongAnswers } = useWrongAnswers();

  return (
    <MobileLayout>
      <div className="p-6 space-y-8 pb-10">
        
        {/* Header - Welcome */}
        <header className="flex justify-between items-center pt-2">
          <div>
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-50">
              안녕하세요, {user?.firstName || '학생'}님 👋
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1 tracking-tight">오늘도 복습 시작해볼까요?</p>
          </div>
          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-slate-500 font-bold">{user?.firstName?.[0] || 'U'}</span>
            )}
          </div>
        </header>

        {/* Streak / Motivation Banner */}
        <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-teal-50 dark:bg-teal-950/20 transform skew-x-12 translate-x-8"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-teal-100 dark:bg-teal-900/60 p-2.5 rounded-lg border border-teal-200 dark:border-teal-800">
              <Flame className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100 tracking-tighter">7</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">일 연속 학습 중!</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                오늘도 1문제 복습으로 캘리포니아 스위트룸.
              </p>
            </div>
          </div>
        </section>

        {/* SM-2 Review Queue */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-100">
              <BookOpen className="w-4 h-4 text-blue-700" />
              오늘의 복습 큐
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-mono text-[10px] px-1.5 py-0.5 rounded-sm font-bold ml-1 border border-blue-200 dark:border-blue-800">
                {isLoadingReviews ? "..." : dueReviews.length}
              </span>
            </h2>
            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
              모두 보기
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingReviews ? (
              <div className="text-center py-4 text-slate-500 font-medium">로딩 중...</div>
            ) : dueReviews.length === 0 ? (
              <div className="text-center py-4 text-slate-500 font-medium">오늘 진행할 복습이 없습니다! 🎉</div>
            ) : (
              dueReviews.map((item) => (
                <div key={item.repetition.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center relative border border-slate-200/50 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 font-mono scale-75 opacity-70">
                      {item.wrongAnswer.extractedText?.slice(0, 15) || "수식"}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">
                        {item.wrongAnswer.subject || "과목"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {item.wrongAnswer.conceptTags?.[0] || "주제 없음"}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                      {item.wrongAnswer.errorCategory || "분석 대기중"}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-1.5 py-0.5 rounded">
                      D-{Math.ceil((new Date(item.repetition.nextReviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) > 0 ? Math.ceil((new Date(item.repetition.nextReviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : "Day"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </div>
              ))
            )}

            
          </div>
        </section>

        {/* Recent History Shortcut */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Clock className="w-5 h-5 text-teal-600" />
              최근에 틀린 문제
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             {isLoadingWrongAnswers ? (
               <div className="col-span-2 text-center py-4 text-slate-500 font-medium">로딩 중...</div>
             ) : wrongAnswers.length === 0 ? (
               <div className="col-span-2 text-center py-4 text-slate-500 font-medium">등록된 오답이 없습니다.</div>
             ) : (
               wrongAnswers.slice(0, 4).map((wa) => {
                 const diffDays = Math.floor((new Date().getTime() - new Date(wa.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                 return (
                   <div key={wa.id} className="bg-slate-100 dark:bg-slate-800 rounded-2xl aspect-square p-3 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                     <span className="text-[10px] font-bold text-slate-500 ml-auto bg-white/60 dark:bg-black/20 px-1.5 rounded">
                       {diffDays === 0 ? "오늘" : diffDays === 1 ? "어제" : `${diffDays}일 전`}
                     </span>
                     <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                       {wa.subject || "미분류"} • {wa.conceptTags?.[0] || "주제 없음"}
                     </div>
                   </div>
                 );
               })
             )}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
