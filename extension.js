// Installation:
//  1. mkdir -p ~/.local/share/gnome-shell/extensions/switch-to-last-keyboard-layout@envek
//  2. cp ./extension.js ./metadata.json ~/.local/share/gnome-shell/extensions/switch-to-last-keyboard-layout@envek
//  3. Restart GNOME Shell (e.g. log out and log in)
//  4. Enable it in the GNOME Extensions App
// Usage:
// gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/SwitchToLastKeyboardLayout --method org.gnome.Shell.Extensions.SwitchToLastKeyboardLayout.Call

const { Gio } = imports.gi;
const { getInputSourceManager } = imports.ui.status.keyboard;

const MR_DBUS_IFACE = `
<node>
    <interface name="org.gnome.Shell.Extensions.SwitchToLastKeyboardLayout">
        <method name="Call">
        </method>
    </interface>
</node>`;

class Extension {
    enable() {
        this._dbus = Gio.DBusExportedObject.wrapJSObject(MR_DBUS_IFACE, this);
        this._dbus.export(
            Gio.DBus.session,
            "/org/gnome/Shell/Extensions/SwitchToLastKeyboardLayout"
        );
    }

    disable() {
        this._dbus.flush();
        this._dbus.unexport();
        delete this._dbus;
    }

    Call() {
        getInputSourceManager()._mruSources[1].activate();
    }
}

function init() {
    return new Extension();
}
