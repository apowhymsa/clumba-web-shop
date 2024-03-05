import Link from "next/link";
import { FC } from "react";

import "./oferta.scss";

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="px-5 md:px-10 bg-light dark:bg-dark text-dark dark:text-light">
      <h1 className="text-center font-semibold text-lg leading-10 my-4">
        ДОГОВОР ПУБЛІЧНОЇ ОФЕРТИ
      </h1>
      <p>
        Цей договір є офіційною та публічною пропозицією Продавця укласти
        договір купівлі-продажу Товару, представленого на сайті{" "}
        <Link
          href="https://clumba.kr.ua"
          className="text-blue-700 underline hover:no-underline"
          prefetch={false}
        >
          https://clumba.kr.ua
        </Link>{" "}
        (далі – Сайт). Даний договір є публічним, тобто відповідно до статті 633
        Цивільного кодексу України, його умови є однаковими для всіх покупців
        незалежно від їх статусу (фізична особа, юридична особа, фізична
        особа-підприємець) без надання переваги одному покупцю перед іншим.
        Шляхом укладення цього Договору Покупець в повному обсязі приймає умови
        та порядок оформлення замовлення, оплати товару, доставки товару, та усі
        інші умови договору. Договір вважається укладеним з моменту проведення
        оплати на сторінці оформлення замовлення і отримання Покупцем від
        Продавця підтвердження успішної оплати замовлення.
      </p>
      <div className="clause-l1">
        <h3>1. Визначення термінів</h3>
        <p>
          1.1. Публічна оферта (далі – «Оферта») – публічна пропозиція Продавця,
          адресована невизначеному колу осіб, укласти з Продавцем договір
          купівлі-продажу товару дистанційним способом (далі – «Договір») на
          умовах, що містяться в цій Оферті.
        </p>
        <p>
          1.2. Товар або Послуга – товар, який був обраний покупцем на Сайті та
          поміщений у кошик.
        </p>
        <p>
          1.3. Сайт – веб-сайт, що належить Продавцю, розташований за адресою:{" "}
          <Link
            href="https://clumba.kr.ua"
            className="text-blue-700 underline hover:no-underline"
            prefetch={false}
          >
            https://clumba.kr.ua
          </Link>
          .
        </p>
        <p>
          1.4. Покупець – дієздатна фізична особа, фізична особа-підприємець,
          та/або юридична особа, яка розміщує замовлення щодо купівлі товару,
          який представлений на Сайті для цілей, що не пов`язані зі здійсненням
          підприємницької діяльності.
        </p>
        <p>
          1.5. Отримувач – особа, визначена Покупцем як безпосередній одержувач
          Товару.
        </p>
      </div>
      <div className="clause-l1">
        <h3>2. Предмет Договору</h3>
        <p>
          2.1. Продавець зобов`язується передати у власність Покупцю Товар, а
          Покупець зобов`язується оплатити і прийняти Товар (якщо Покупець є
          Отримувачем) на умовах цього Договору.
        </p>
        <p>
          2.2. Датою укладення Договору-оферти (акцептом оферти) та моментом
          повного й беззаперечного прийняттям Покупцем умов Договору вважається
          дата/час проведення оплати на сторінці оформлення замовлення і
          отримання Покупцем від Продавця підтвердження успішної оплати
          замовлення.
        </p>
      </div>
      <div className="clause-l1">
        <h3>3. Оформлення Замовлення</h3>
        <p>
          3.1. Покупець самостійно оформлює замовлення на сайті через форму
          «Кошика» шляхом натискання кнопки «Перейти до сплати».
        </p>
        <p>
          3.2. При оформленні замовлення на Cайті Покупець зобов`язується надати
          наступну обов`язкову інформацію, необхідну Продавцю для виконання
          замовлення:
          <ul>
            <li>3.2.1. прізвище, ім`я Покупця;</li>
            <li>
              3.2.2. адреса, за якою слід доставити Товар; 3.2.3. контактний
              телефон для зв`язку;
            </li>
          </ul>
        </p>
        <p>
          3.3. Найменування, кількість, ціна обраного Покупцем Товару вказуються
          в кошику Покупця на Сайті.
        </p>
        <p>
          3.4. Якщо Продавцю буде необхідна додаткова інформація, він має право
          запросити її у Покупця. У разі ненадання необхідної інформації
          Покупцем, Продавець не несе відповідальності за надання якісної
          послуги Покупцю при замовленні.
        </p>
        <p>
          3.5. При оформленні замовлення через оператора Продавця Покупець
          зобов`язується надати інформацію, зазначену в п. 3.3 – 3.4. цієї
          Оферти.
        </p>
        <p>
          3.6. Ухвалення Покупцем умов цієї Оферти здійснюється за допомогою
          внесення Покупцем відповідних даних в реєстраційну форму на Сайті або
          при оформленні Замовлення через оператора. Після оформлення Замовлення
          через Оператора дані про Покупця вносяться до бази даних Продавця.
        </p>
        <p>
          3.7. Покупець несе відповідальність за достовірність наданої
          інформації при оформленні Замовлення.
        </p>
        <p>
          3.8. Укладаючи Договір, тобто акцептуючи умови даної пропозиції
          (запропоновані умови придбання Товару), шляхом оформлення Замовлення,
          Покупець підтверджує наступне:
          <ol className="list-disc ml-4">
            <li>
              Покупець цілком і повністю ознайомлений, і згоден з умовами цієї
              пропозиції (оферти);
            </li>
            <li>
              він дає дозвіл на збір, обробку та передачу персональних даних,
              дозвіл на обробку персональних даних діє протягом усього терміну
              дії Договору, а також протягом необмеженого терміну після
              закінчення його дії. Крім цього, укладенням договору Покупець
              підтверджує, що він повідомлений (без додаткового повідомлення)
              про права, встановлені Законом України «Про захист персональних
              даних», про мету збору даних, а також про те, що його персональні
              дані передаються Продавцю з метою можливості виконання умов цього
              Договору, можливості проведення взаєморозрахунків, а також для
              отримання розрахункових документів. Покупець також погоджується з
              тим, що Продавець має право надавати доступ та передавати його
              персональні дані третім особам без будь-яких додаткових
              повідомлень Покупця лише з метою виконання замовлення Покупця, або
              у випадках, передбачених діючим законодавством. Обсяг прав
              Покупця, як суб`єкта персональних даних відповідно до Закону
              України «Про захист персональних даних» йому відомий і зрозумілий.
            </li>
          </ol>
        </p>
      </div>
      <div className="clause-l1">
        <h3>4. Ціна на Товар та послуги</h3>
        <p>
          4.1 Ціни на Товари та послуги визначаються Продавцем самостійно та
          вказані на Сайті.
        </p>
        <p>
          4.2 Ціни на Товари та послуги можуть змінюватися Продавцем в
          односторонньому порядку залежно від кон`юнктури ринку.
        </p>
        <p>
          4.3. Вартість Товару, яка вказана на Сайті не включає в себе вартість
          доставки Товару Покупцю.
        </p>
        <p>
          4.4. Умови та вартість доставки зазначається Продавцем на Сайті, і
          може змінюватися ним в односторонньому порядку, в залежності від
          кон’юнктури ринку та обставин, що не залежать від волі Продавця
          (територія доставки). За проханням Покупця Продавець може надати
          детальну інформацію про актуальні умови та вартість доставки, що діють
          на момент замовлення.
        </p>
        <p>
          4.5. Зобов`язання Покупця по оплаті Товару вважаються виконаними з
          моменту надходження Продавцю коштів на його рахунок.
        </p>
        <p>
          4.6. Розрахунки між Продавцем і Покупцем за Товар здійснюються
          способами, зазначеними на Сайті в розділі «Доставка та оплата».
        </p>
        <p>
          4.7. При отриманні товару Покупець повинен у присутності кур’єра
          перевірити відповідність Товару якісним і кількісним характеристикам
          (найменування товару, кількість, комплектність). У випадку, якщо
          Покупець не є Отримувачем, відповідність товару перевіряє Отримувач
          під час отримання Товару.
        </p>
        <p>
          4.8. Право власності та ризик випадкової втрати або пошкодження Товару
          переходить до Покупця або Отримувача з моменту отримання Товару за
          адресою доставки або у точці самовивезення.
        </p>
        <p>
          4.9. У випадку, якщо безпосереднім Одержувачем є інша особа, а не
          Покупець, відносини між Сторонами за цим договором регулюються
          положеннями ст.636 Цивільного кодексу України.
        </p>
      </div>
      <div className="clause-l1">
        <h3>5. Права та обов’язки Сторін</h3>
        <p>
          <span className="font-semibold">5.1. Продавець зобов`язаний:</span>
          <ul>
            <li>
              5.1.1. Передати Покупцеві або Отримувачу товар у відповідності до
              умов цього Договору та замовлення Покупця.
            </li>
            <li>
              5.1.2. Не розголошувати будь-яку приватну інформацію про Покупця і
              не надавати доступ до цієї інформації третім особам, за винятком
              персоналу Продавця з метою виконання Замовлення, та/або випадків,
              передбачених законодавством.
            </li>
          </ul>
        </p>
        <p>
          <span className="font-semibold">5.2. Продавець має право:</span>
          <ul>
            <li>
              5.2.1 Змінювати умови цього Договору, а також ціни на Товари та
              послуги, в односторонньому порядку, розміщуючи їх на Сайті. Всі
              зміни набувають чинності з моменту їх публікації.
            </li>
          </ul>
        </p>
        <p>
          <span className="font-semibold">5.3 Покупець зобов`язується:</span>
          <ul>
            <li>
              5.3.1 До моменту укладення Договору ознайомитися зі змістом
              Договору, умовами Договору і цінами, запропонованими Продавцем на
              Сайті.
            </li>
            <li>
              5.3.2 На виконання Продавцем своїх зобов`язань перед Покупцем
              останній повинен повідомити всі необхідні дані, що однозначно
              ідентифікують його як Покупця, і достатні для доставки Покупцеві
              або Отримувачу замовленого Товару.
            </li>
          </ul>
        </p>
      </div>
      <div className="clause-l1">
        <h3>6. Правила доставки товару</h3>
        <p>
          6.1. При виборі послуги «Вказати конкретну дату та час доставки», в
          рамках встановлених періодів доставок, вона здійснюється з інтервалом
          +/- 30 хвилин від зазначеного Покупцем часу.
        </p>
        <p>
          6.2 Після передачі Продавцем замовлення Кур`єру (використовуються
          Кур`єрські сервіси: Glovo, Uklon), Продавець знімає з себе
          відповідальність за подальше збереження товару.
        </p>
        <p>
          6.3. Продавець звільняється від будь-якої відповідальності, якщо:
          <ul className="list-disc ml-4">
            <li>у вказаний Покупцем час, Одержувача не було на місці, або</li>
            <li>Одержувач відмовився від отримання замовлення, або</li>
            <li>
              мають місце погіршення погодних умов, які створили глобальні
              затори по місту, на які Продавець вплинути не може.
            </li>
          </ul>
        </p>
      </div>
      <div className="clause-l1">
        <h3>7. Відповідальність</h3>
        <p>
          7.1. Продавець не несе відповідальності за неналежне, несвоєчасне
          виконання Замовлення у випадку надання Покупцем недостовірної,
          неповної та/або помилкової інформації.
        </p>
        <p>
          7.2. Продавець і Покупець несуть відповідальність за виконання своїх
          зобов`язань відповідно до чинного законодавства України і положень
          цього Договору.
        </p>
        <p>
          7.3. Продавець або Покупець звільняються від відповідальності за повне
          або часткове невиконання своїх зобов`язань, якщо невиконання є
          наслідком форс-мажорних обставин та непереборної сили, як то: війна
          або військові дії, землетрус, повінь, пожежа та інші стихійні лиха, що
          виникли незалежно від волі Продавця і/або Покупця після укладення
          цього договору. Сторона, яка не може виконати свої зобов`язання,
          негайно повідомляє про це іншу Сторону та надає відповідні докази
          засвідчення вказаних обставин.
        </p>
      </div>
      <div className="clause-l1">
        <h3>8. Конфіденційність і захист персональних даних</h3>
        <p>
          8.1. Залишаючи свої персональні дані на Сайті під час реєстрації або
          оформлення Замовлення, Покупець надає Продавцеві свою добровільну
          згоду на обробку, використання (у тому числі і передачу) своїх
          персональних даних, а також вчинення інших дій, передбачених Законом
          України «Про захист персональних даних», без обмеження терміну дії
          такої згоди.
        </p>
        <p>
          8.2. Продавець зобов`язується не розголошувати отриману від Покупця
          інформацію. Не вважається порушенням надання Продавцем інформації
          контрагентам і третім особам, що діють на підставі договору з
          Продавцем, в тому числі і для виконання зобов`язань перед Покупцем, а
          також у випадках, коли розкриття такої інформації встановлено вимогами
          чинного законодавства України.
        </p>
        <p>
          8.3. Покупець несе відповідальність за підтримання своїх персональних
          даних в актуальному стані. Продавець не несе відповідальності за
          неякісне виконання або невиконання своїх зобов`язань у зв`язку з
          неактуальністю інформації про Покупця або невідповідністю її
          дійсності.
        </p>
      </div>
      <div className="clause-l1">
        <h3>9. Безпека Сайту</h3>
        <p>
          9.1. Продавець забезпечує та підтримує безпеку функціонування Сайту.
        </p>
        <p>
          9.2. Проте, Продавець не може гарантувати безпеку функціонування Сайту
          у випадку обставин, що від нього не залежать, зокрема: відсутність
          електроенергії та/або збої роботи комп`ютерної мережі, незаплановані
          зміни алгоритмів адміністрацією соціальних мереж, глобальні перебої в
          роботі релевантних сегментів мережі Інтернет, збої систем
          маршрутизації, збої в розподіленій системі доменних імен, збої,
          викликані хакерськими і DDOS-атаками, комп`ютерними вірусами тощо.
        </p>
      </div>
      <div className="clause-l1">
        <h3>10. Права інтелектуальної власності</h3>
        <p>
          10.1. Всі об`єкти, розміщені Продавцем на Сайті, в тому числі елементи
          дизайну, текст, графічні зображення, ілюстрації, відео, скрипти,
          музика, звуки і інші об`єкти та їх добірки, комп`ютерні програми, бази
          даних, вихідні коди і інше, створені Продавцем для функціонування і
          розвитку Сайту, є об`єктами виняткових прав інтелектуальної власності
          під належним захистом.
        </p>
        <p>
          10.2. Використання об`єктів інтелектуальної власності, що містяться на
          Сайті без отримання дозволу власника заборонено, зокрема, Покупець не
          має права:
          <ul className="list-disc ml-4">
            <li>
              будь-яким способом змінювати, створювати похідні продукти,
              демонструвати, публічно відтворювати, поширювати вміст Сайту або
              іншим чином використовувати його в будь-яких публічних або
              комерційних цілях;
            </li>
            <li>
              видаляти, приховувати або іншим чином спотворювати вказівки
              автора, включаючи повідомлення про будь-які права інтелектуальної
              власності з будь-якого вмісту Сайту;
            </li>
            <li>
              декомпілювати, розбирати чи будь-яким іншим способом намагатися
              витягти вихідний код програмного забезпечення, що є елементом
              Сайту;
            </li>
            <li>
              поширювати, ускладнювати, продавати, субліцензувати,
              використовувати програмне забезпечення, що є елементом Сайту, або
              будь-яким іншим способом передавати права на таке програмне
              забезпечення;
            </li>
            <li>
              використовувати помилки програмного забезпечення втручатися в
              програмний код, несанкціоновано отримувати доступ до комп`ютерної
              системи, отримувати без належного дозволу новий доступ до бази
              даних користувачів або матеріалів Сайту.
            </li>
          </ul>
        </p>
      </div>
      <div className="clause-l1">
        <h3>11. Політика щодо cookie-файлів</h3>
        <p>
          11.1. Файли cookie – це текстові файли невеликого обсягу, що
          зберігаються на комп`ютері Покупця, планшеті або мобільному телефоні.
          При відвідуванні Покупцем Сайту файли cookie дозволяють Сайту
          «запам`ятовувати» Покупця і його переваги для підвищення якості
          взаємодії з Сайтом.
        </p>
        <p>
          11.2. Продавець використовує cookie-файли для персоналізації контенту
          і поліпшення користувацького досвіду. Переглядаючи Сайт, Поупець надає
          свою згоду на використання cookie-файлів. Покупець може контролювати
          cookie-файли та керувати їх використанням через свій браузер.
          Продавець звертає увагу на те, що видалення або блокування
          cookie-файлів може відбитися на призначеному для Покупця інтерфейсі
          Сайту і зробити частину компонентів Сайту недоступними.
        </p>
        <p>
          11.3. Більшість браузерів дозволяють переглядати, видаляти і блокувати
          cookie-файли c сайтів. Зверніть увагу, що в разі видалення усіх
          cookie-файлів відбувається збій всіх налаштувань Покупця, включаючи
          можливість відмовитися від cookie-файлів, оскільки ця функція сама по
          собі вимагає розміщення на пристрої Покупця відповідного cookie-файлу,
          що передбачає таку відмову.
        </p>
      </div>
      <div className="clause-l1">
        <h3>12. Правила повернення товару</h3>
        <p>
          12.1. Компанія здійснює повернення і обмін товарів належної якості
          згідно Закону{" "}
          <Link
            className="text-blue-700 underline hover:no-underline"
            href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          >
            &#34;Про захист прав споживачів&#34;
          </Link>
          .
        </p>
        <p>
          12.2. Повернення та обмін товарів можливий протягом 3 днів після
          отримання товару покупцем.
        </p>
        <p>
          12.3. Умови повернення для товарів належної якості Згідно з законом
          України &#34;Про захист прав споживачів&#34; і ст. 707 Гражданського
          кодексу України, квіти не підлягають обміну або поверненню:
          <ul className="list-disc ml-4">
            <li>
              квіти належать до товарів, які швидко псуються, тому очевидно, що
              зберегти їх властивості та товарний вигляд можливо тільки шляхетно
              для спеціальних умов;
            </li>
            <li>
              дитячі м`які іграшки, харчові товари (конфети, фрукти, торти) не
              підлягають обміну або поверненню відповідно до Постанова КМУ від
              19 березня 1994 р. No 172. Звертаємо Вашу увагу на те, що живі
              квіти належать до категорії товарів, які не підлягають поверненню.
            </li>
          </ul>
        </p>
        <p>
          12.4. Якщо виникають додаткові питання, Ви можете зв`язатися з
          адміністративністю магазину. Відповідно закону{" "}
          <Link
            className="text-blue-700 underline hover:no-underline"
            href="https://zakon.rada.gov.ua/laws/show/1023-12#Text"
          >
            &#34;Про захист прав споживачів&#34;
          </Link>
          , компанія може відмовити споживачеві в обміні та поверненні товарів
          належної якості, якщо вони відносяться до категорій, зазначених у
          чинному{" "}
          <Link
            className="text-blue-700 underline hover:no-underline"
            href="https://zakon.rada.gov.ua/laws/show/172-94-%D0%BF#Text"
          >
            &#34;Переліку непродовольчих товарів належної якості, що не
            підлягають поверненню та обміну.&#34;
          </Link>
        </p>
      </div>
      <div className="clause-l1">
        <h3>13. Інші умови</h3>
        <p>
          13.1. Цей договір укладено на території України і діє відповідно до
          чинного законодавства України.
        </p>
        <p>
          13.2. Усі спори, що виникають між Покупцем і Продавцем, вирішуються
          шляхом переговорів. У випадку недосягнення врегулювання спірного
          питання шляхом переговорів, Покупець та/або Продавець мають право
          звернутися за вирішенням спору до державних органів, в компетенції
          яких знаходиться розгляд подібних спорів у відповідності до чинного
          законодавства України.
        </p>
        <p>
          13.3. Продавець має право вносити зміни до цього Договору в
          односторонньому порядку.
        </p>
      </div>
    </div>
  );
};

export default Page;
