// Installation:
//  1. mkdir -p ~/.local/share/gnome-shell/extensions/keyboard-layout-groups@perchun
//  2. cp ./extension.js ./metadata.json ~/.local/share/gnome-shell/extensions/keyboard-layout-groups@perchun
//  3. Restart GNOME Shell (e.g. log out and log in)
//  4. Enable it in the GNOME Extensions App
// Usage:
// gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/SwitchToLastKeyboardLayout --method org.gnome.Shell.Extensions.SwitchToLastKeyboardLayout.Call

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { getInputSourceManager } from "resource:///org/gnome/shell/ui/status/keyboard.js";

// group names cannot be changed and new groups cannot be added from here
// this is because im lazy. if you need - modify the code/open an issue/dm me
const LAYOUT = [
    /* cyrilic group */
    ["ua", "ru"],
    /* latin group */
    ["us", "cz+qwerty"],
];

const MR_DBUS_IFACE = `
<node>
    <interface name="org.gnome.Shell.Extensions.KeyboardLayoutGroups">
        <method name="ChangeGroup">
        </method>
        <method name="ChangeLayout">
        </method>
    </interface>
</node>`;

/**
 * Always operates only inside our `.config` folder.
 */
class Filesystem {
    /**
     * @param {string | undefined} path if undefined - whole directory
     */
    constructor(path) {
        this.path = Gio.File.new_for_path(
            GLib.build_filenamev([
                GLib.get_home_dir(),
                ".config",
                "keyboard-layouts",
                ...(path === undefined ? [] : [path]),
            ])
        );
    }

    mkdir_with_parents() {
        try {
            this.path.make_directory_with_parents(null);
        } catch (e) {
            console.warn("error during creating config folder", e);
        }
    }

    /**
     * @param {string} content
     */
    write(content) {
        this.path
            .create(Gio.FileCreateFlags.NONE, null)
            .write_bytes(new GLib.Bytes(content), null);
    }

    /**
     * @param {string} content
     */
    overwrite(content) {
        this.path
            .replace(null, false, Gio.FileCreateFlags.NONE, null)
            .write_bytes(new GLib.Bytes(content), null);
    }

    /**
     * @returns {string}
     */
    read() {
        const [ok, contents, etag] = this.path.load_contents(null);

        const decoder = new TextDecoder("utf-8");
        return decoder.decode(contents);
    }
}

export default class MyExtension extends Extension {
    enable() {
        this._dbus = Gio.DBusExportedObject.wrapJSObject(MR_DBUS_IFACE, this);
        this._dbus.export(
            Gio.DBus.session,
            "/org/gnome/Shell/Extensions/KeyboardLayoutGroups"
        );

        this.#readData();
    }

    #readData() {
        new Filesystem().mkdir_with_parents(); // create config directory if not exists

        for (const [file_name, default_value] of [
            ["group.txt", "lat"],
            ["lat_lang.txt", "us"],
            ["cyr_lang.txt", "ua"],
        ]) {
            try {
                new Filesystem(file_name).write(default_value);
            } catch (e) {
                console.warn(
                    "error during writing default value to config files",
                    e
                );
            }
        }

        this._current_group = new Filesystem("group.txt").read();
        this._lat_lang = new Filesystem("lat_lang.txt").read();
        this._cyr_lang = new Filesystem("cyr_lang.txt").read();
    }

    disable() {
        this._dbus.flush();
        this._dbus.unexport();
        delete this._dbus;
    }

    /**
     * @param {'lat' | 'cyr'} to
     */
    #switchGroup(new_group) {
        new Filesystem("group.txt").overwrite(new_group);
        this._current_group = new_group;
    }

    /**
     * @param {string} to
     */
    #switchLayout(new_layout) {
        if (this._current_group == "lat") {
            new Filesystem("lat_lang.txt").overwrite(new_layout);
            this._lat_lang = new_layout;
        } else {
            new Filesystem("cyr_lang.txt").overwrite(new_layout);
            this._cyr_lang = new_layout;
        }

        getInputSourceManager()
            ._mruSources.find((v) => v.id == new_layout)
            .activate();
    }

    ChangeGroup() {
        if (this._current_group == "lat") {
            this.#switchGroup("cyr");
            this.#switchLayout(this._cyr_lang)
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
