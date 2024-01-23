# keyboard layout groups

This is my GNOME extention for my extremely specific use case of layouts.

They is a feature on Windows, I don't know its name, but it allows to group multiple simmilar languages to one group.
So I had two groups: Ukrainian + russian and English + Czech.
By pressing `CTRL SHIFT` I switched between groups and with `ALT SHIFT` I switched between lagnuages in groups.

Lack of this feature on Linux holded me from switching to it for a long time, but now I finally have it.

## Installation

```bash
git clone https://PerchunPak/keyboard-layout-groups ~/.local/share/gnome-shell/extensions/keyboard-layout-groups@perchun
```

Relogin to your PC, so GNOME could detect a new extention. Then enable the extention and add custom keybinds to these commands:

```bash
# Switch groups
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/KeyboardLayoutGroups --method org.gnome.Shell.Extensions.KeyboardLayoutGroups.ChangeGroup
# Switch layouts
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/KeyboardLayoutGroups --method org.gnome.Shell.Extensions.KeyboardLayoutGroups.ChangeLayout
```

---

This won't be published to https://extensions.gnome.org as it is extremely specific and languages are hardcoded.
If you want something simillar - it is better to just fork this repo.

## Thanks

To [this gist](https://gist.github.com/Envek/85f40478d1c8b9658621190569046447), the only place where I found how to programmatically change keyboard layout.
