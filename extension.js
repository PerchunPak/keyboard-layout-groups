import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import Gio from "gi://Gio";
import { getInputSourceManager } from "resource:///org/gnome/shell/ui/status/keyboard.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import Meta from "gi://Meta";
import Shell from "gi://Shell";

// group names cannot be changed and new groups cannot be added from here
// this is because im lazy. if you need - modify the code/open an issue/dm me
const LAYOUT = [
    /* cyrilic group */
    ["ua", "ru"],
    /* latin group */
    ["us", "cz+qwerty"],
];

export default class MyExtension extends Extension {
    enable() {
        this._settings = this.getSettings(
            "org.gnome.shell.extensions.keyboard-layout-groups",
        );
        this.#addKeybinds();

        this._current_group = "lat";
        this._lat_lang = "us";
        this._cyr_lang = "ua";
    }

    disable() {
        Main.wm.removeKeybinding("change-keyboard-layout-group");
        Main.wm.removeKeybinding("change-keyboard-layout");
    }

    #addKeybinds() {
        Main.wm.addKeybinding(
            "change-keyboard-layout-group",
            this._settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            this.ChangeGroup,
        );

        Main.wm.addKeybinding(
            "change-keyboard-layout",
            this._settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
            this.ChangeLayout,
        );
    }

    /**
     * @param {'lat' | 'cyr'} to
     */
    #switchGroup(new_group) {
        this._current_group = new_group;
    }

    /**
     * @param {string} to
     */
    #switchLayout(new_layout) {
        if (this._current_group == "lat") {
            this._lat_lang = new_layout;
        } else {
            this._cyr_lang = new_layout;
        }

        getInputSourceManager()
            ._mruSources.find((v) => v.id == new_layout)
            .activate();
    }

    ChangeGroup() {
        if (this._current_group == "lat") {
            this.#switchGroup("cyr");
            this.#switchLayout(this._cyr_lang);
        } else {
            this.#switchGroup("lat");
            this.#switchLayout(this._lat_lang);
        }
    }

    ChangeLayout() {
        if (this._current_group == "lat") {
            if (this._lat_lang == "us") {
                this.#switchLayout("cz+qwerty");
            } else {
                this.#switchLayout("us");
            }
        } else {
            if (this._cyr_lang == "ua") {
                this.#switchLayout("ru");
            } else {
                this.#switchLayout("ua");
            }
        }
    }
}
