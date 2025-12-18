class ZaperonButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const clientId = this.getAttribute("client-id");
    const redirectUri = this.getAttribute("redirect-uri");
    const text = this.getAttribute("text") || "Login with Zaperon";
    const iconAttr = this.getAttribute("icon");
    let iconSrc;
    if (iconAttr) {
        iconSrc = iconAttr;
    }else {
        const fallbackSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 496.6"><defs><style>.cls-1{fill:url(#linear-gradient);}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:url(#linear-gradient-3);}</style><linearGradient id="linear-gradient" y1="102.24" x2="500" y2="102.24" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4eb757"/><stop offset="0.34" stop-color="#4ebd92"/><stop offset="0.64" stop-color="#4ec2bf"/><stop offset="0.87" stop-color="#4ec5da"/><stop offset="1" stop-color="#4ec6e4"/></linearGradient><linearGradient id="linear-gradient-2" x1="495.21" y1="262.67" x2="0" y2="262.67" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3659a7"/><stop offset="0.38" stop-color="#4679bd"/><stop offset="0.77" stop-color="#5394cf"/><stop offset="1" stop-color="#589ed6"/></linearGradient><linearGradient id="linear-gradient-3" x1="109.98" y1="373.27" x2="500" y2="373.27" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4fc4d2"/><stop offset="1" stop-color="#804a9c"/></linearGradient></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M500,34.07V146.65a33.63,33.63,0,0,1-4.86,14.89c0-1.12.07-2.24.07-3.37a89.9,89.9,0,0,0-89.91-89.9c-2.63,0-5.24.11-7.81.34a34.29,34.29,0,0,0-5.1-.45H102.23a34.1,34.1,0,0,0-34.07,33.65v68.63A34.07,34.07,0,0,1,35.4,204.49H32.78A34.08,34.08,0,0,1,0,170.44V34.08A34.11,34.11,0,0,1,34.08,0H466.36A34.08,34.08,0,0,1,500,34.07Z"/><path class="cls-2" d="M495.21,158.17c0,1.13,0,2.25-.07,3.37a34.19,34.19,0,0,1-5,6.36,33.82,33.82,0,0,1-9.32,6.62c-.5.24-1,.47-1.51.68l-.1.05-47.37,21.09-18.31,8.15-60.41,26.9-41.65,18.54-61.53,27.39L161.51,316.7h0A75.62,75.62,0,0,0,154,457.08L68.16,418.86,21.3,398l-.1-.05L19.12,397h0A34.08,34.08,0,0,1,0,366.41V336a34.19,34.19,0,0,1,17.63-29.85.45.45,0,0,1,.12-.06l5-2.21a0,0,0,0,1,0,0l45.43-20.22,75.78-33.74L246,204.49l2.74-1.21,1.2-.54,66.69-29.68,87.94-39.16.17-.07s0,0,0,0l2.23-1a.11.11,0,0,0,.06,0,34.08,34.08,0,0,0,9-54.64,33.86,33.86,0,0,0-18.56-9.53c2.57-.23,5.18-.34,7.81-.34A89.9,89.9,0,0,1,495.21,158.17Z"/><path class="cls-3" d="M500,284v82.42a34.1,34.1,0,0,1-18.84,30.48l-.06,0h0l-2.62,1.17-46.62,20.75-98.09,43.67-68.92,30.7c-.6.28-1.2.55-1.82.8a34.09,34.09,0,0,1-26.21-.08c-.53-.21-1.06-.45-1.57-.7l-69-30.72-10-4.47c-.73-.31-1.45-.63-2.17-1A75.62,75.62,0,0,1,161.5,316.7l-6.75,3a.16.16,0,0,0-.1,0c-.61.24-1.21.52-1.81.8l-.09,0a34.09,34.09,0,0,0-.06,61.32l.15.08c.62.29,1.25.58,1.89.83,0,0,0,0,0,0l80,35.62a0,0,0,0,0,.05,0l2.68,1.19A33.88,33.88,0,0,0,250,422a31.86,31.86,0,0,0,3.4-.17,33.26,33.26,0,0,0,8.8-2.09s0,0,0,0l3.22-1.43h0L409.84,354a.7.7,0,0,0,.2-.08s0,0,0,0,0,0,0,0l2.88-1.27h0l.11-.06a34.12,34.12,0,0,0,18.75-30.44V284A34.08,34.08,0,0,1,465,249.93h1.75A34.09,34.09,0,0,1,500,284Z"/></g></g></svg>');
        const fallbackDataUrl = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;
        iconSrc = fallbackDataUrl
    }


    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
        .zapBtn {
          display: inline-flex;
          align-items: center;
          gap: 0px;
          border-radius: 4px;
          padding: 4px;
          border: none;
          background-color: #003FB9;
          color: #fff;
          cursor: pointer;
          font: inherit;
          width: 200px;
          }
          img.icon {
            width: 18px;
            height: 18px;
            display: block;
            }
        .imgBg {
          padding: 8px;
          border-radius: 4px;
          background: #ffffff;
        }
        .label { 
        line-height: 1; 
        font-size: 14px; 
        font-weight: 600;
        margin-left: auto;
        margin-right: auto;
        }
      </style>
      <button class="zapBtn">
        <div class="imgBg">
            <img class="icon" src="${iconSrc}" alt="zaperon" />
        </div>
        <span class="label">${text}</span>
      </button>
    `;

    // Probe-load the resolved icon; if it succeeds, replace the inline fallback.
    try {
      const imgEl = this.shadowRoot.querySelector('img.icon');
      const probe = new Image();
      probe.onload = () => {
        imgEl.src = iconSrc;
        console.log('zaperon-btn: icon loaded', iconSrc);
      };
      probe.onerror = (err) => {
        console.warn('zaperon-btn: icon failed to load, keeping fallback', iconSrc, err);
      };
      probe.src = iconSrc;
    } catch (e) {
      console.warn('zaperon-btn: icon probe failed', e);
    }

    console.log("zaperon-btn: connected", { clientId, redirectUri, text });

    this.shadowRoot.querySelector("button").onclick = async () => {
      console.log("zaperon-btn: click", { clientId, redirectUri });
      const fn = this.constructor.requestAuthorizationCode;
      if (typeof fn === "function") {
        try {
          const res = await fn({ client_id: clientId, redirect_uri: redirectUri });
          console.log("zaperon-btn: requestAuthorizationCode returned", res);
        } catch (err) {
          console.error("zaperon-btn: requestAuthorizationCode threw", err);
        }
      } else {
        console.error("zaperon: requestAuthorizationCode is not available. Ensure the library is imported/registered on the client.");
      }
    };
  }
}

export { ZaperonButton };
