# keyboard layout groups

This is my GNOME extention for my extremely specific use case of layouts.

They is a feature on Windows, I don't know its name, but it allows to group multiple simmilar languages to one group.
So I had two groups: Ukrainian + russian and English + Czech.
By pressing `CTRL SHIFT` I switched between groups and with `ALT SHIFT` I switched between lagnuages in groups.

Lack of this feature on Linux holded me from switching to it for a long time, but now I finally have it.

## Installation

```bash
git clone --depth 1 https://PerchunPak/keyboard-layout-groups ~/.local/share/gnome-shell/extensions/keyboard-layout-groups@perchun
cd ~/.local/share/gnome-shell/extensions/keyboard-layout-groups@perchun
glib-compile-schemas schemas/
```

Relogin to your PC, so GNOME could detect a new extention. Then bindings Shift + Alt should switch groups and Shift + Ctrl should switch layouts inside groups.

If you want to customize keybindings/languages - you have to modify source code.

---

This won't be published to https://extensions.gnome.org as it is extremely specific and languages are hardcoded.
If you want something simillar - it is better to just fork this repo.

## Thanks

To [this gist](https://gist.github.com/Envek/85f40478d1c8b9658621190569046447), the only place where I found how to programmatically change keyboard layout.
