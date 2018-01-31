import constants from './constants/';

export const unified = (params, cb) => {
  const token = localStorage.getItem('g_token');
  fetch(`${constants.REMOTE_URL}/wxpay/unified`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({...params}),
  }).then(res => res.json().then((json) => {
    if(!json.sucess){
      if (cb) cb((res.err_msg !== 'get_brand_wcpay_request:ok'), json);
    } else {
      window.WeixinJSBridge.invoke('getBrandWCPayRequest', json.result, (res) => {
        //alert(JSON.stringify(res));
        if (cb) cb((res.err_msg !== 'get_brand_wcpay_request:ok'), json);
      });
    }
  }));
};
