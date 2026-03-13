# About

Integration of a Litera5 API into Adobe InDesign

<div>
    <strong>What is Litera5?</strong>
    <p>An intelligent spelling and grammar checker for the Russian language, based on methods of computational linguistics and machine learning. Litera5 detects even complex errors in punctuation, grammar, spelling, and style, providing detailed explanations and suggesting corrections.</p>
</div>

<div>
    <img src="./readme/plugin showcase.gif">
</div>

### Light and dark themes

<p align="center">
  <img src="./readme/dark.png" alt="Темная тема" width=45%/> 
&nbsp; &nbsp; &nbsp; &nbsp;
   <img src="./readme/light.png" alt="Светлая тема" width=45%/>
</p>

<!-- ## Необходимые инструменты

- Indesign
- Creative Cloud
- npm

## Начало работы

1. Скачать репозиторий.
2. Перейти по пути `src/litera5/config.ts`. В конфиге заполнить название организации и [ключ API от Литера5](https://litera5.ru/).
3. Запустить команду `npm run ccx`.
4. Запустить полученный файл с расширением `.ccx`, подтвердить все всплывающие окна в Creative Cloud и дождаться окончания установки. -->

<!-- > [!NOTE]
> Возможно, если во время установки у Вас будет открыт Indesign, то плагин сразу не появится в Indesign. В таком случае нужно перезапустить Indesign, затем в меню сверху перейти в "Модули" -> "Litera5_Plugin" -->

## Known issues

- It is recommended to scroll through the list of annotations using the plugin scrollbar. If you use the mouse wheel for scrolling, the cursor may encounter a glitch, resulting in a slight delay before it can process a click on an annotation (to make it active). It is okay to use mouse wheel, please be aware of this issue.
- The Style Override Highlighter can sometimes overlap highlighted annotations. Therefore, it is better to turn this tool off while checking text.
    <p align="center">
    <img src="./readme/sredstvo-videlenya-nastroek-stiley.png" alt="средство выделения настроек стилей в Indesign">
    </p>
- If you change the first letter at the beginning of a highlighted error, the character style of this letter will remain. However, if the annotation is later will be removed (user delete it in the plugin panel), the highlighted text will not be entirely removed; the first (changed) letter will retain highlight.
  For example: if the word "ganuary" is corrected to "january" and the annotation is then removed, the program will highlight "j"(anuary) — meaning the letter "j" will keep the highlight.

## Limitations

- Do not deselect the text/frame until the plugin has finished checking.
- InDesign does not blend colors in character styles, so if your text contains multiple types of annotations (with different colors), one color will always overlap another. However, an annotation that is overlapped will receive "its own" color when you select it in the plugin panel.
- The plugin does not work with tables (if table cell was selected. Though, it will work with text selected in cell). However, if you need to select text before and after a table, the example below shows how to do it. In this example, if you select the text frame, only the text outside the table will be checked.

<p align="center">
    <img src="./readme/pravilnoe-videlenye-s-tablicey.png" alt="Правильный метод выделения текста сквозь таблицу"/>
</p>

## Contributions

You are welcome to make contributions to this plugin.
