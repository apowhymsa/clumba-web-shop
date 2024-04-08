import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    Underline,
    Strikethrough,
    Essentials,
    Heading,
    Indent,
    Italic,
    Link,
    List,
    Paragraph,
    Table,
    TableToolbar,
    TextTransformation,
  ];

  // Editor configuration.
  public static override defaultConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'alignment',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'outdent',
        'indent',
      ],
    },
    language: 'en',
    // removePlugins: ['EasyImage', 'ImageUpload', 'MediaEmbed'],
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };
}

export default Editor;
