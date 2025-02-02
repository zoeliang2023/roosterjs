import ContentModelBeforePasteEvent from '../../publicTypes/event/ContentModelBeforePasteEvent';
import domToContentModel from '../../domToModel/domToContentModel';
import {
    ClipboardData,
    EditorCore,
    NodePosition,
    PasteType,
    PluginEventType,
} from 'roosterjs-editor-types';
import { ContentModelEditorCore, CreatePasteModel } from '../../publicTypes/ContentModelEditorCore';
import {
    createDefaultHtmlSanitizerOptions,
    createFragmentFromClipboardData,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Create content model from clipboard data
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format
 */
export const createPasteModel: CreatePasteModel = (
    core: ContentModelEditorCore,
    clipboardData: ClipboardData,
    position: NodePosition | null,
    pasteAsText: boolean,
    applyCurrentStyle: boolean,
    pasteAsImage: boolean = false
) => {
    const pasteType = getPasteType(pasteAsText, applyCurrentStyle, pasteAsImage);
    const event = createBeforePasteEvent(core, clipboardData, pasteType);

    const fragment = createFragmentFromClipboardData(
        core,
        clipboardData,
        position,
        pasteAsText,
        applyCurrentStyle,
        pasteAsImage,
        event
    );

    return domToContentModel(fragment, core.api.createEditorContext(core), event.domToModelOption);
};

/**
 * @internal
 * Exported only for unit test
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @returns
 */
export function createBeforePasteEvent(
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType
): ContentModelBeforePasteEvent {
    const options = createDefaultHtmlSanitizerOptions();

    // Remove "caret-color" style generated by Safari to make sure caret shows in right color after paste
    options.cssStyleCallbacks['caret-color'] = () => false;

    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        fragment: core.contentDiv.ownerDocument.createDocumentFragment(),
        sanitizingOption: options,
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        domToModelOption: {},
        pasteType: pasteType,
    };
}

function getPasteType(pasteAsText: boolean, applyCurrentStyle: boolean, pasteAsImage: boolean) {
    if (pasteAsText) {
        return PasteType.AsPlainText;
    } else if (applyCurrentStyle) {
        return PasteType.MergeFormat;
    } else if (pasteAsImage) {
        return PasteType.AsImage;
    } else {
        return PasteType.Normal;
    }
}
