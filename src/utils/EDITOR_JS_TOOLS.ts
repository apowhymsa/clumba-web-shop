import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import CheckList from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,
    embed: Embed,
    // table: Table,
    list: List,
    // warning: Warning,
    // code: Code,
    // linkTool: LinkTool,
    // image: Image,
    // raw: Raw,
    header: Header,
    quote: Quote,
    // marker: Marker,
    // checklist: CheckList,
    // delimiter: Delimiter,
    // inlineCode: InlineCode,
    // simpleImage: SimpleImage
};
