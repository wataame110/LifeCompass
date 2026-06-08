import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Trash2, FileJson, FileText, ChevronLeft } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function ExportPage() {
  const handleExportJSON = () => {
    const data = localStorage.getItem('lc_diagnosis');
    if (!data) { alert('保存されたデータがありません'); return; }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-compass-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleClearData = () => {
    if (!confirm('すべての診断データを削除しますか？この操作は元に戻せません。')) return;
    localStorage.removeItem('lc_diagnosis');
    localStorage.removeItem('lc_darkMode');
    alert('データを削除しました。トップページに戻ります。');
    window.location.href = '/';
  };

  const hasData = !!localStorage.getItem('lc_diagnosis');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Link to="/result" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
          <ChevronLeft className="w-4 h-4" />
          結果画面に戻る
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">データ管理</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          すべてのデータはブラウザ内にローカル保存されています。外部サーバーには送信されません。
        </p>

        {/* Ad */}
        <div className="lc-ad-space mb-6">
          <span>広告スペース</span>
        </div>

        <div className="space-y-4">
          <div className="lc-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileJson className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">JSON形式でエクスポート</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">生データを他のツールやバックアップに利用できます。</p>
            </div>
            <button onClick={handleExportJSON} disabled={!hasData} className="lc-btn-outline text-sm px-4 py-2 disabled:opacity-40">
              <Download className="w-4 h-4" />
              保存
            </button>
          </div>

          <div className="lc-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">プリント / PDF出力</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ブラウザの印刷機能を使ってPDF化できます。</p>
            </div>
            <button onClick={handleExportPDF} className="lc-btn-primary text-sm px-4 py-2">
              <FileText className="w-4 h-4" />
              印刷
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="lc-card p-5 flex items-center gap-4 border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/5">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-red-700 dark:text-red-300">データを削除</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">保存されている診断データをすべて削除します。</p>
              </div>
              <button onClick={handleClearData} className="px-4 py-2 rounded-xl border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-colors">
                削除する
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
