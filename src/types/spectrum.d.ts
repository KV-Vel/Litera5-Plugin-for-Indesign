/**
 * Adobe Spectrum Web Components
 * @see https://opensource.adobe.com/spectrum-web-components/
 *
 * Список доступных Spectrum Web компонентов Indesign
 * @see https://developer.adobe.com/indesign/uxp/reference/uxp-api/reference-spectrum/Spectrum%20UXP%20Widgets/User%20Interface/
 *
 * Чтобы React распознавал эти компоненты:
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/71395#discussioncomment-11949214
 */

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            "sp-button": any;
            "sp-action-button": any;
            "sp-checkbox": any;
            "sp-icon": any;
            "sp-textfield": any;
            "sp-progressbar": any;
            "sp-label": any;
        }
    }
}
