import moment from 'moment';

const subject1 = (period: any, day: any): string => {
  return `【リマインド】GNW${period.year}${period.periodIndex === 1 ? '上期' : '下期'} 目標設定のお願い（${
    period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).month() + 1 : '  '
  }月${period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).date() : '  '}日 (${
    Object.values(day)[period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).day() : 0]
  }) まで）`;
};

const template1 = (period: any, day: any): string => {
  return `お疲れ様です。<br/><br/>
    GNW算定会議事務局です。<br/><br/>
    ${period.year}${
    period.periodIndex === 1 ? '上期' : '下期'
  }目標設定期日が近づいてまいりましたので、ご連絡させていただきました。<br/>
    期日までに評価システムにログインし、目標設定を完了してください。<br/><br/>

    ■ログイン情報<br/>
    1. URL：
    <a href="${process.env.REACT_APP_HOST}" rel="noopener noreferrer" target="_blank"">${
    process.env.REACT_APP_HOST
  }</a><br/>

    2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br/><br/>


    ■目標設定期限<br/>
    ${period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).month() + 1 : '  '}月${
    period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).date() : '  '
  }日 (${Object.values(day)[period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).day() : 0]})&nbsp;
    23:59まで&nbsp;<br/><br/>

    お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。<br>\n`;
};

const subject2 = (period: any): string => {
  return `【期限延長】GNW${period.year}${period.periodIndex === 1 ? '上期' : '下期'} 目標設定`;
};

const template2 = (period: any, day: any): string => {
  return `お疲れ様です。<br><br>GNW算定会議事務局です。<br><br></span><span>${period.year}${
    period.periodIndex === 1 ? '上期' : '下期'
  }</span>目標設定期日が過ぎてしまいましたが、
    <br>未提出の状況であるため期間を延長し再案内いたします。
    <br>評価システムにログインし、目標設定を完了してください。<br><br>■ログイン情報<br>　1．URL：
    </span><a href="${process.env.REACT_APP_HOST}" rel="noopener noreferrer" target="_blank"">${
    process.env.REACT_APP_HOST
  }</a><span>
    <br>　2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br><br>■実施期間<br>【変更前】</span><span>${
      period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).month() + 1 : '  '
    }月${period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).date() : '  '}日 (${
    Object.values(day)[period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).day() : 0]
  })</span><span>
    &nbsp;~&nbsp;</span><span>${period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).month() + 1 : '  '}月${
    period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).date() : '  '
  }日 (${Object.values(day)[period.dateCreationGoalEnd ? moment(period.dateCreationGoalEnd).day() : 0]})
    </span><span><br>【変更後】</span><span>
    ${period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).month() + 1 : '  '}月${
    period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).date() : '  '
  }日 (${
    Object.values(day)[period.dateCreationGoalStart ? moment(period.dateCreationGoalStart).day() : 0]
  })</span><span>&nbsp;~&nbsp;</span><span style="color:#ff0000;"><strong>M月DD日 (date)</strong>
    </span><span><br><br>これ以上の期間延長は行わないので、確実に実施お願いいたします。
    <br><br>お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。<br>\n`;
};

const subject3 = (period: any, day: any): string => {
  return `【リマインド】GNW${period.year}${period.periodIndex === 1 ? '上期' : '下期'} 評価実施のお願い（${
    period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).month() + 1 : '  '
  }月${period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).date() : '  '}日 (${
    Object.values(day)[period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).day() : 0]
  }) まで）`;
};

const template3 = (period: any, day: any): string => {
  return `お疲れ様です。<br><br>GNW算定会議事務局です。<br>
    <br></span><span>${period.year}${
    period.periodIndex === 1 ? '上期' : '下期'
  }</span><span>評価実施期日が近づいてまいりましたので、ご連絡させていただきました。
    <br>期日までに評価システムにログインし、評価を完了してください。<br><br>■ログイン情報<br>　1．URL：
    </span><a href="${process.env.REACT_APP_HOST}" rel="noopener noreferrer" target="_blank"">${
    process.env.REACT_APP_HOST
  }</a><span>
    <br>　2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br><br>■評価実施期限<br></span>
    <span>${period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).month() + 1 : '  '}月${
    period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).date() : '  '
  }日 (${Object.values(day)[period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).day() : 0]})</span> 
    <span>23:59まで&nbsp;<br><br>お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。<br>\n`;
};

const subject4 = (period: any): string => {
  return `【期限延長】GNW${period.year}${period.periodIndex === 1 ? '上期' : '下期'} 評価実施`;
};

const template4 = (period: any, day: any): string => {
  return `お疲れ様です。<br><br>GNW算定会議事務局です。<br><br></span><span>
    ${period.year}${period.periodIndex === 1 ? '上期' : '下期'}</span><span>評価実施期日が過ぎてしまいましたが、
    <br>未提出の状況であるため期間を延長し再案内いたします。
    <br>評価システムにログインし、評価を完了してください。<br><br>■ログイン情報<br>　1．URL：</span>
    <a href="${process.env.REACT_APP_HOST}" rel="noopener noreferrer" target="_blank"">${
    process.env.REACT_APP_HOST
  }</a><span>
    <br>　2．ユーザ名・パスワードはPCにログインするユーザ名・パスワードと同様。<br><br>■実施期間<br>【変更前】</span><span>${
      period.dateEvaluationStart ? moment(period.dateEvaluationStart).month() + 1 : '  '
    }月${period.dateEvaluationStart ? moment(period.dateEvaluationStart).date() : '  '}日 (${
    Object.values(day)[period.dateEvaluationStart ? moment(period.dateEvaluationStart).day() : 0]
  })</span><span>
    &nbsp;~&nbsp;</span><span>${period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).month() + 1 : '  '}月${
    period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).date() : '  '
  }日 (${Object.values(day)[period.dateEvaluationEnd ? moment(period.dateEvaluationEnd).day() : 0]}</span>)
    <span><br>【変更後】</span><span>${
      period.dateEvaluationStart ? moment(period.dateEvaluationStart).month() + 1 : '  '
    }月${period.dateEvaluationStart ? moment(period.dateEvaluationStart).date() : '  '}日 (${
    Object.values(day)[period.dateEvaluationStart ? moment(period.dateEvaluationStart).day() : 0]
  })
    </span><span>&nbsp;~&nbsp;</span><span style="color:#ff0000;font-size:11pt;">
    <strong>{M月DD日 (date)}</strong> </span><span>
    <br><br>これ以上の期間延長は行わないので、確実に実施お願いいたします。<br><br>お忙しいところ恐れ入りますが、どうぞよろしくお願いいたします。<br>\n`;
};

export const mailTemplate = {
  template1,
  template2,
  template3,
  template4,
  subject1,
  subject2,
  subject3,
  subject4,
};
