import React from 'react';
import './MailingEditor.css';

interface IMailingEditorPreviewerProps {
  htmlContent: string;
}

export default function MailingEditorPreviewer({
  htmlContent,
}: IMailingEditorPreviewerProps) {
  return (
    <div className="editor-previewer-container">
      <div className="editor-previewer-wrapper">
        <div style={{ textAlign: 'center' }}>
          <span>
            <img
              style={{ display: 'inline-block' }}
              src="/clumba-cl.png"
              alt="clumba logo"
              width="70"
              height="70"
            />
          </span>
        </div>
        <div
          className="main ck-editor"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
      <div
        className="editor-previewer-footer"
        style={{ backgroundColor: '#f2f6ff', padding: 20, fontSize: 14 }}
      >
        <div
          style={{
            paddingBlock: 10,
            paddingInline: 0,
            textAlign: 'center',
            display: 'block',
          }}
        >
          <a
            className="inst-logo"
            href="https://www.instagram.com/clumba.krrog/"
            target="_blank"
          >
            <img
              src="/instagram-48.png"
              style={{ margin: 0 }}
              alt="inst logo"
              width="20"
              height="20"
            />
          </a>
        </div>
        <hr color="#adb0b9" style={{ height: 1, marginBlock: 8 }} />
        <p style={{ textAlign: 'center', color: '#adb0b9' }}>
          Якщо у Вас є запитання, Ви можете відправити ваше запитання на
          <strong>
            <a
              target="_blank"
              style={{ color: '#343740' }}
              href="mailto:clumbaeshop@gmail.com"
            >
              {' '}
              clumbaeshop@gmail.com
            </a>
          </strong>
          , зателефонувати нам за номером
          <strong>
            <a
              target="_blank"
              style={{ color: '#343740' }}
              href="tel:+380960746794"
            >
              {' '}
              +380960746794{' '}
            </a>
          </strong>
          або написати нам у будь якій соціальний мережі
        </p>
        <p style={{ textAlign: 'center', marginBlock: 14 }}>
          <a
            target="_blank"
            style={{ color: '#adb0b9' }}
            href="https://maps.app.goo.gl/gCWziqSDFh1raEPd6"
          >
            вул. Десантна 7А
          </a>
        </p>
        <div style={{ textAlign: 'center', color: '#adb0b9' }}>
          <a
            target="_blank"
            href="https://clumba.kr.ua"
            style={{ marginRight: 5, color: '#adb0b9' }}
          >
            Наш сайт
          </a>
          <span
            style={{
              display: 'inline-block',
              width: 1,
              height: 15,
              background: '#b7bac3',
              paddingTop: 3,
            }}
          ></span>
          <a
            target="_blank"
            style={{ marginLeft: 5, color: '#adb0b9' }}
            href="https://clumba.kr.ua/products?limit=15&page=1&sort=2&price=0-10000&category=all"
          >
            Нові товари
          </a>
        </div>
      </div>
    </div>
  );
}
