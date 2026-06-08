import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-lc-dark-border bg-gray-50 dark:bg-lc-dark-bg mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Life Compass. 全て無料・会員登録不要・勧誘なし。
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          本サービスの分析結果は参考情報です。就職・転職の最終判断はご自身の責任で行ってください。
        </p>
      </div>
    </footer>
  );
}
