import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]'
})

export class CopyToClipboardDirective {

  @Input('copy-clipboard') public payload: string;

  @Output() public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) { return; }

    const range = document.createRange();
    range.selectNodeContents(document.body);
    document.getSelection().addRange(range);

    const listener = (e: ClipboardEvent) => {
      // window["clipboardData"] is needed for IE as it does not understand e.clipboardData
      const clipboard = e.clipboardData || window['clipboardData'];
      clipboard.setData('text', this.payload.toString());
      e.preventDefault();
      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);

    document.getSelection().removeAllRanges();
  }
}
