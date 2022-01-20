/******************************************************************************

     Liberated Pixel Cup demo engine
     -------------------------------

     Copyright (C) 2012 Liberated Pixel Cup contributors.
       See AUTHORS for details.
 
     This program is free software: you can redistribute it and/or modify
     it under the terms of the GNU General Public License as published by
     the Free Software Foundation, either version 3 of the License, or
     (at your option) any later version.

     This program is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     GNU General Public License for more details.

     You should have received a copy of the GNU General Public License
     along with this program.  If not, see <http://www.gnu.org/licenses/>.


 ******************************************************************************

     Check out our git repository: https://gitorious.org/liberated-pixel-cup

 ******************************************************************************/
(function() {
    var a = -1;
    window.RequestAnimationFrame = window.RequestAnimationFrame || window.mozRequestAnimationFrame || window.requestAnimationFrame || window.msRequestAnimationFrame || function(b) {
        if (a === -1) {
            a = setTimeout(function() {
                b();
                a = -1
            }, 100 / 60)
        }
    }
})();
var LPCD = {
    DOM: {
        doc: undefined,
        res: {},
        layers: {}
    },
    CHARS: {},
    ACTORS: {
        registry: {
            player: [],
            level: [],
            visible: [],
            focus: undefined,
        },
        AbstractKind: undefined,
        PersistentKind: undefined,
        VisibleKind: undefined,
        ObjectKind: undefined
    },
    API: {
        global: {},
        store_default: undefined,
        store: undefined,
        fetch: undefined,
        add_warp: undefined,
        distance: undefined,
        create_object: undefined,
    },
    DATA: {
        bootstrapping: true,
        ready: false,
        level: {
            name: "",
            debug: undefined,
            walls: {},
            warps: {},
            dynamics: false,
            min_x: undefined,
            max_x: undefined,
            min_y: undefined,
            max_y: undefined
        }
    },
    CURSOR: {
        downed_time: -1,
        x: undefined,
        y: undefined,
        active: false
    },
    TIME: {
        mouse_timer: -1
    },
    CALL: {
        repaint: undefined,
        find_actor: undefined,
        link_actor: undefined,
        unlink_actor: undefined,
        unlink_transients: undefined,
        move_actors: undefined,
        build_map: undefined,
        get_wall: undefined,
        set_wall: undefined,
        wall_check: undefined,
        add_tile: undefined,
        add_warp: undefined,
        get_warp: undefined,
        warp_check: undefined,
        mouse_cancel: undefined,
        cue_loading: undefined,
    },
    EVENT: {
        on_warp: undefined,
        on_mouse_check: undefined,
        on_mouse_down: undefined,
        on_mouse_up: undefined,
        on_walk: undefined,
        map_ready: undefined,
        make: undefined
    }
};
$(document).ready(function() {
    LPCD.DOM.frame = $("#lpcd_iframe")[0].contentWindow;
    var b = LPCD.DOM.doc = $("#lpcd_iframe").contents()[0];
    if (window.top === window) {
        LPCD.CHARS.alice(0, 0);
        var a = LPCD.ACTORS.registry.visible[0];
        a._gain_input_focus();
        a.dir = 2;
        LPCD.EVENT.on_warp(undefined, undefined, "start1.json")
    } else {
        window.document.body.innerHTML = ""
    }
});
LPCD.CALL.set_wall = function(a, d) {
    var c = Math.round(a);
    var b = Math.round(d);
    LPCD.DATA.level.walls[String(c) + "," + String(b)] = true
};
LPCD.CALL.add_tile = function(h, g, c, a, f, e) {
    var d = LPCD.DOM.layers[e];
    var b = LPCD.DOM.res[f];
    d.ctx.drawImage(b, h * 32, g * 32, 32, 32, c * 32, a * 32, 32, 32)
};
LPCD.CALL.add_warp = function(b, k, a, i, m, l, n) {
    var c = LPCD.DATA.level.warps;
    b = Math.round(b);
    a = Math.round(a);
    k = Math.round(k);
    i = Math.round(i);
    var j = b < a ? b : a;
    var h = b < a ? a : b;
    var e = k < i ? k : i;
    var d = k < i ? i : k;
    if (n === undefined) {
        n = LPCD.DATA.LEVEL.name
    }
    for (var g = j; g <= h; g += 1) {
        for (var f = e; f <= d; f += 1) {
            c[String(g) + "," + String(f)] = [m, l, n]
        }
    }
};
LPCD.CALL.build_map = function(g) {
    var a = LPCD.DATA.level;
    a.debug = g;
    for (var e = 0; e < g.layers.length; e += 1) {
        var f = g.layers[e];
        var m = 0;
        var l = 0;
        for (var c = 0; c < f.data.length; c += 1) {
            if (f.data[c] > 0) {
                var h = g.lookup_tile(f.data[c]);
                if (h !== false) {
                    if (f.properties === undefined) {
                        f.properties = {}
                    }
                    var b = f.properties.target === undefined ? "below" : f.properties.target;
                    LPCD.CALL.add_tile(h.sx, h.sy, m, l, h.uri, b);
                    if (f.properties.is_walls !== undefined && f.properties.is_walls > 0) {
                        LPCD.CALL.set_wall(m * 2, l * 2);
                        LPCD.CALL.set_wall(m * 2, l * 2 + 1);
                        LPCD.CALL.set_wall(m * 2 + 1, l * 2 + 1);
                        LPCD.CALL.set_wall(m * 2 + 1, l * 2)
                    } else {
                        if (b === "below" && h.props !== undefined && h.props.wall !== undefined) {
                            var n;
                            switch (h.props.wall) {
                                case "a":
                                    n = [
                                        [0, 0],
                                        [0, 1],
                                        [1, 0],
                                        [1, 1]
                                    ];
                                    break;
                                case "nw":
                                    n = [
                                        [0, 0]
                                    ];
                                    break;
                                case "n":
                                    n = [
                                        [0, 0],
                                        [1, 0]
                                    ];
                                    break;
                                case "ne":
                                    n = [
                                        [1, 0]
                                    ];
                                    break;
                                case "e":
                                    n = [
                                        [1, 0],
                                        [1, 1]
                                    ];
                                    break;
                                case "se":
                                    n = [
                                        [1, 1]
                                    ];
                                    break;
                                case "s":
                                    n = [
                                        [0, 1],
                                        [1, 1]
                                    ];
                                    break;
                                case "sw":
                                    n = [
                                        [0, 1]
                                    ];
                                    break;
                                case "w":
                                    n = [
                                        [0, 0],
                                        [0, 1]
                                    ];
                                    break;
                                default:
                                    n = []
                            }
                            for (var d = 0; d < n.length; d += 1) {
                                LPCD.CALL.set_wall(m * 2 + n[d][0], l * 2 + n[d][1])
                            }
                        }
                    }
                } else {
                    console.info("no such tile: " + f.data[c])
                }
            }
            m += 1;
            if (m == g.width) {
                l += 1;
                m = 0
            }
        }
    }
};
LPCD.CALL.load_dynamics = function() {
    var c = LPCD.DATA.level;
    if (c.dynamics) {
        var b = LPCD.DATA.level.dynamics + "?a=" + Date.now();
        var a = LPCD.DOM.doc.createElement("iframe");
        a.id = "script_dynamics";
        LPCD.DOM.doc.body.appendChild(a);
        a.doc = a.contentWindow.document;
        a.contentWindow.API = LPCD.API;
        a.doc.write("<script type='text/javascript' src='" + b + "'><\/script>");
        a.doc.close()
    }
};
LPCD.EVENT.on_warp = function(a, d, c) {
    var b = LPCD.ACTORS.registry.focus;
    if (a !== undefined) {
        b.x = a
    }
    if (d !== undefined) {
        b.y = d
    }
    b._stop();
    if (c !== undefined && LPCD.DATA.level.name !== c) {
        LPCD.CALL.cue_loading();
        LPCD.DATA.level = {
            name: c,
            walls: {},
            warps: {},
            dynamics: false,
            min_x: 0,
            max_x: 0,
            min_y: 0,
            max_y: 0
        };
        jQuery.getJSON("./_static/demogame/levels/" + c, LPCD.EVENT.map_ready)
    } else {
        LPCD.CALL.repaint()
    }
};
LPCD.EVENT.map_ready = function(f, b) {
    var g = 0;
    var a = true;
    var k = function() {
        LPCD.CALL.build_map(f);
        LPCD.EVENT.make(f);
        LPCD.DOM.doc.body.onmousedown = LPCD.EVENT.on_mouse_down;
        LPCD.DOM.doc.body.onmouseup = LPCD.EVENT.on_mouse_up
    };
    var j = function() {
        g -= 1;
        if (g === 0 && !a) {
            k()
        }
    };
    if (f.orientation !== "orthogonal") {
        throw ("This demo only supports orthogonal maps!")
    }
    for (var d = 0; d < f.tilesets.length; d += 1) {
        var e = f.tilesets[d];
        e.image = "./_static/gamesprites/" + e.image.split("/").slice(-1);
        if (LPCD.DOM.res[e.image] === undefined) {
            g += 1;
            LPCD.DOM.res[e.image] = new Image();
            LPCD.DOM.res[e.image].onload = j;
            LPCD.DOM.res[e.image].src = e.image
        }
        f.tilesets[d]._w = Math.floor(e.imagewidth / 32);
        f.tilesets[d]._h = Math.floor(e.imageheight / 32);
        f.tilesets[d]._count = e._w * e._h;
        f.tilesets[d].has = function(i) {
            return i >= this.firstgid && i < this.firstgid + this._count
        };
        f.tilesets[d].get = function(o) {
            var n = o - this.firstgid;
            var i = n % this._w;
            var m;
            if (this.tileproperties !== undefined) {
                m = this.tileproperties[n]
            }
            return {
                props: m,
                sx: i,
                sy: ((n - i) / this._w)
            }
        }
    }
    f.lookup_tile = function(n) {
        for (var m = 0; m < f.tilesets.length; m += 1) {
            var p = f.tilesets[m];
            if (p.has(n)) {
                var o = p.get(n);
                o.uri = p.image;
                return o
            }
        }
        return false
    };
    LPCD.DATA.level.max_x = f.width;
    LPCD.DATA.level.max_y = f.height;
    LPCD.DATA.level.dynamics = "./_static/demogame/dynamics/" + LPCD.DATA.level.name + ".js";
    if (f.properties !== undefined) {
        if (f.properties.dynamics !== undefined) {
            LPCD.DATA.level.dynamics = f.properties.dynamics
        }
        if (f.properties.spawn_point !== undefined && LPCD.DATA.bootstrapping) {
            var c = f.properties.spawn_point.split(",");
            if (c.length === 2) {
                var l = LPCD.ACTORS.registry.focus;
                l.x = parseInt(c[0], 10);
                l.y = parseInt(c[1], 10)
            }
        }
    }
    LPCD.DOM.layers = {};
    var h = function(i) {
        var m = LPCD.DOM.doc.createElement("canvas");
        m.setAttribute("draggable", "false");
        m.ctx = m.getContext("2d");
        m.width = 32 * f.width;
        m.height = 32 * f.height;
        m.id = "layer_" + i;
        LPCD.DOM.layers[i] = m;
        LPCD.DOM.doc.body.appendChild(m)
    };
    h("above");
    h("below");
    a = false;
    if (g === 0) {
        k()
    }
};
LPCD.EVENT.make = function(a) {
    LPCD.DOM.doc.getElementById("text_overlay").style.display = "none";
    LPCD.DATA.ready = true;
    LPCD.DATA.bootstrapping = false;
    var b = LPCD.DOM.layers.actors = LPCD.DOM.doc.createElement("iframe");
    b.id = "layer_actors";
    b.setAttribute("draggable", "false");
    b.setAttribute("scrolling", "no");
    b.setAttribute("frameborder", "0");
    b.style.width = String(32 * a.width) + "px";
    b.style.height = String(32 * a.height) + "px";
    LPCD.DOM.doc.body.appendChild(b);
    b.doc = b.contentWindow.document;
    b.doc.write('<link rel="stylesheet" type="text/css" href="./_static/demogame/lpcd.css" />');
    b.doc.close();
    LPCD.ACTORS.registry.focus._bumped = [];
    LPCD.CALL.mouse_cancel();
    var d = LPCD.ACTORS.registry.visible;
    for (var c = 0; c < d.length; c += 1) {
        d[c]._show()
    }
    LPCD.CALL.load_dynamics();
    LPCD.CALL.repaint()
};
LPCD.CALL.wall_check = function(a, e, d) {
    var c = Math.round(a);
    var b = Math.round(e);
    return LPCD.CALL.get_wall(c, b, d) || LPCD.CALL.get_wall(c + 1, b, d)
};
LPCD.CALL.get_wall = function(a, g, d) {
    var f = LPCD.ACTORS.registry.visible;
    var e = false;
    for (var c = 0; c < f.length; c += 1) {
        if (d !== undefined && f[c]._identity == d._identity) {
            continue
        }
        if (f[c]._blocking !== undefined) {
            e = f[c]._blocking(f[c], a, g);
            if (e) {
                break
            }
        }
    }
    if (!!e) {
        if (d === undefined) {
            LPCD.DATA.player.bumped.push(e)
        } else {
            d._bumped.push(e)
        }
        return true
    }
    var b = LPCD.DATA.level.walls[String(a) + "," + String(g)];
    return b !== undefined ? true : false
};
LPCD.CALL.warp_check = function(a, c) {
    var b = LPCD.CALL.get_warp(Math.round(a), Math.round(c));
    if (b && LPCD.DATA.ready) {
        LPCD.EVENT.on_warp(b[0], b[1], b[2])
    }
};
LPCD.CALL.get_warp = function(a, c) {
    var b = LPCD.DATA.level.warps[String(a) + "," + String(c)];
    return b !== undefined ? b : false
};
LPCD.CALL.mouse_cancel = function() {
    clearTimeout(LPCD.TIME.mouse_timer);
    LPCD.DOM.doc.body.onmousemove = undefined;
    LPCD.CURSOR.active = false;
    LPCD.TIME.mouse_timer = -1
};
LPCD.EVENT.on_mouse_check = function() {
    clearTimeout(LPCD.TIME.mouse_timer);
    if (LPCD.DATA.ready && LPCD.CURSOR.active) {
        var b = LPCD.ACTORS.registry.focus;
        var d = $("#lpcd_iframe").width();
        var c = $("#lpcd_iframe").height();
        var g = (Math.round((LPCD.CURSOR.x / 16)) - Math.ceil(d / 32)) - 1;
        var e = (Math.round((LPCD.CURSOR.y / 16) + 0.5) - Math.ceil(c / 32)) - 1;
        var a = Math.round(g + b.x);
        var f = Math.round(e + b.y);
        if (!b._is_moving || (a !== b.x && f !== b.y)) {
            b._move_to(a, f)
        }
        LPCD.TIME.mouse_timer = setTimeout(LPCD.EVENT.on_mouse_check, 100)
    } else {
        LPCD.TIME.mouse_timer = -1
    }
};
LPCD.EVENT.on_mouse_down = function(a) {
    LPCD.CURSOR = {
        downed_time: Date.now(),
        x: a.x || a.clientX,
        y: a.y || a.clientY,
        active: true
    };
    LPCD.DOM.doc.body.onmousemove = LPCD.EVENT.on_mouse_move;
    LPCD.EVENT.on_mouse_check()
};
LPCD.EVENT.on_mouse_move = function(a) {
    LPCD.CURSOR.x = a.x || a.clientX;
    LPCD.CURSOR.y = a.y || a.clientY
};
LPCD.EVENT.on_mouse_up = function(a) {
    var b = Date.now();
    LPCD.CALL.mouse_cancel();
    if (b - LPCD.CURSOR.downed_time > 300) {
        LPCD.ACTORS.registry.focus._stop()
    }
};
LPCD.ACTORS.AbstractKind = function(b) {
    var a = -1;
    var d = b === "player" ? "player" : "level";
    var c = {
        on_player_enter: function(e, f) {},
        on_delete: function(e) {},
        on_loop: function(e) {},
        _rebind: function(e) {
            d = e === "player" ? "player" : "level";
            LPCD.CALL.unlink_actor(c);
            LPCD.CALL.link_actor(c)
        },
        _frequency: 100,
        _start: function() {
            clearTimeout(a);
            (function e(f) {
                if (!f._deleted && !f._is_player) {
                    f.on_loop(f)
                }
                a = setTimeout(function() {
                    e(f)
                }, f._frequency)
            })(this)
        }
    };
    c.__defineGetter__("_binding", function() {
        return d
    });
    c.__defineGetter__("_identity", function() {
        return c
    });
    return c
};
LPCD.ACTORS.PersistentKind = function() {
    var a = new LPCD.ACTORS.AbstractKind("player");
    var b = Object.create(a);
    b.on_player_leaves = function(c, d) {};
    return b
};
LPCD.ACTORS.VisibleKind = function(p, o, n, b) {
    var a = new LPCD.ACTORS.AbstractKind(p);
    var c = Object.create(a);
    var g = o,
        f = n,
        d = false;
    var h = false,
        k = 0,
        i = 0,
        l = 0,
        q = 0;
    var r;
    var j = function(s) {
        return String(s) + "px"
    };
    var e = function(s) {
        r = LPCD.DOM.res[d];
        s._div.style.backgroundImage = "url('" + d + "')";
        m(s)
    };
    var m = function(s) {
        var t = "";
        if (h) {
            s._div.style.width = j(l);
            s._div.style.height = j(q);
            t += j(k * -1) + " " + j(i * -1)
        } else {
            s._div.style.width = j(r.width || 0);
            s._div.style.height = j(r.height || 0);
            t = "0px 0px"
        }
        s._div.style.backgroundPosition = t;
        s._dirty()
    };
    c._div = LPCD.DOM.doc.createElement("div");
    c._div.setAttribute("class", "actor");
    c.__defineGetter__("width", function() {
        return h ? l : r !== undefined ? r.width : 0
    });
    c.__defineGetter__("height", function() {
        return h ? q : r !== undefined ? r.height : 0
    });
    c.__defineGetter__("img", function() {
        return d
    });
    c.__defineSetter__("img", function(v) {
        if (v !== d) {
            var u = this;
            d = v;
            var s = LPCD.DOM.res[d];
            if (s !== undefined) {
                if (s.width === 0) {
                    var t = s.onload;
                    s.onload = function() {
                        try {
                            t()
                        } catch (w) {}
                        e(u)
                    }
                } else {
                    e(u)
                }
            } else {
                r = LPCD.DOM.res[d] = new Image();
                r.onload = function() {
                    e(u)
                };
                r.src = d
            }
        }
    });
    c.__defineGetter__("x", function() {
        return g
    });
    c.__defineSetter__("x", function(s) {
        if (s !== g) {
            g = s;
            this._dirty()
        }
    });
    c.__defineGetter__("y", function() {
        return f
    });
    c.__defineSetter__("y", function(s) {
        if (s !== f) {
            f = s;
            this._dirty()
        }
    });
    c._show = function() {
        var s = LPCD.DOM.layers.actors;
        if (s !== undefined) {
            s.contentWindow.document.body.appendChild(this._div);
            this._refresh()
        }
    };
    c._hide = function() {
        if (this._div.parentNode) {
            this._div.parentNode.removeChild(this._div)
        }
    };
    c._crop = function(t, s, u, v) {
        h = true;
        k = t;
        i = s;
        l = u;
        q = v;
        m(this)
    };
    c._dirty = function(u) {
        if (u || this._is_player === false) {
            var t = (this.x * 16);
            var s = (this.y * 16) - this.height;
            this._div.style.top = j(s);
            this._div.style.left = j(t);
            this._div.style.zIndex = String(Math.round(s))
        }
    };
    c._refresh = function() {
        e(this)
    };
    c.img = b;
    return c
};
LPCD.ACTORS.ObjectKind = function(h, g, d) {
    var j = new LPCD.ACTORS.VisibleKind("level", h, g, d);
    var c = Object.create(j);
    var e, b, a = 0,
        f = 0;
    var i = function(k) {
        return String(k) + "px"
    };
    c.__defineGetter__("_block_width", function() {
        return e
    });
    c.__defineSetter__("_block_width", function(k) {
        e = k
    });
    c.__defineGetter__("_block_height", function() {
        return b
    });
    c.__defineSetter__("_block_height", function(k) {
        b = k;
        this._dirty()
    });
    c.__defineGetter__("_img_x_offset", function() {
        return a
    });
    c.__defineSetter__("_img_x_offset", function(k) {
        a = k;
        this._dirty()
    });
    c.__defineGetter__("_img_y_offset", function() {
        return f
    });
    c.__defineSetter__("_img_y_offset", function(k) {
        f = k;
        this._dirty()
    });
    c._deleted = false;
    c.on_delete = function(k) {
        k._deleted = true
    };
    c._blocking = function(l, k, o) {
        var m = l._block_width !== undefined ? l._block_width : l.width / 16;
        var n = l._block_height !== undefined ? l._block_height : l.height / 16;
        if (k >= l.x && k < l.x + m && o >= l.y && o < l.y + n) {
            return l
        }
    };
    c._dirty = function(m) {
        if (m || !this._is_player) {
            var l = (this.x + this._img_x_offset) * 16;
            var k = ((this.y + this._img_y_offset) * 16) - this.height + this._block_height * 16;
            this._div.style.top = i(k);
            this._div.style.left = i(l);
            this._div.style.zIndex = String(Math.round(k) + this.height)
        }
    };
    c.on_bumped = function(k, l) {
        alert("Hi there!");
        return true
    };
    return c
};
LPCD.ACTORS.AnimateKind = function(k, i, r) {
    var d = new LPCD.ACTORS.ObjectKind(k, i, r);
    var h = Object.create(d);
    var j = 40;
    var p = 0.5;
    var o = 2;
    h._bumped = [];
    var g;
    var f = 0;
    var e = false;
    var l = false;
    var n = -1;
    var c;
    var q = function(t, s) {
        return Math.sqrt(Math.pow((s - t), 2))
    };
    h._gain_input_focus = function() {
        try {
            LPCD.ACTORS.registry.focus._lose_input_focus();
            g = LPCD.ACTORS.registry.focus;
            LPCD.ACTORS.registry.focus._ignore = this
        } catch (s) {}
        LPCD.ACTORS.registry.focus = this;
        LPCD.CALL.unlink_actor(this, true);
        LPCD.ACTORS.registry.visible.push(this);
        this._show();
        e = true;
        c = this._move_speed;
        this._move_speed -= 25;
        if (this.on_gained_focus !== undefined) {
            this.on_gained_focus(this)
        }
    };
    h._lose_input_focus = function() {
        e = false;
        if (this._binding === "level") {
            LPCD.CALL.unlink_actor(this, true);
            LPCD.CALL.link_actor(this, true);
            this._move_speed = c
        } else {
            LPCD.CALL.unlink_actor(this, true);
            LPCD.CALL.link_actor(this, false)
        }
        if (this.on_lost_focus !== undefined) {
            this.on_lost_focus()
        }
    };
    h.__defineGetter__("_move_speed", function() {
        return j
    });
    h.__defineSetter__("_move_speed", function(s) {
        j = s
    });
    h.__defineGetter__("_move_dist", function() {
        return p
    });
    h.__defineSetter__("_move_dist", function(s) {
        p = s
    });
    h.__defineGetter__("_steps", function() {
        return f
    });
    h.__defineGetter__("_is_moving", function() {
        return !!l
    });
    h.__defineGetter__("_is_player", function() {
        return e
    });
    h._repaint = function() {};
    h.__defineGetter__("dir", function() {
        return o
    });
    h.__defineSetter__("dir", function(s) {
        if (s >= 4 || s <= 4) {
            s = s % 4
        }
        o = s;
        this._repaint()
    });
    h._look_at = function(s, t) {
        if (s >= h.x && t <= h.y) {
            h.dir = q(h.x, s) > q(h.y, t) ? 3 : 0
        } else {
            if (s <= h.x && t <= h.y) {
                h.dir = q(h.x, s) > q(h.y, t) ? 1 : 0
            } else {
                if (s <= h.x && t >= h.y) {
                    h.dir = q(h.x, s) > q(h.y, t) ? 1 : 2
                } else {
                    if (s >= h.x && t >= h.y) {
                        h.dir = q(h.x, s) > q(h.y, t) ? 3 : 2
                    }
                }
            }
        }
        this._repaint()
    };
    h._move_to = function(s, t) {
        l = {
            x: s,
            y: t
        };
        clearTimeout(n);
        n = m(this)
    };
    h._stop = function() {
        f = 0;
        l = false;
        clearTimeout(n);
        n = -1
    };
    var b, a;
    h._wander = function(s) {
        if (s === undefined) {
            s = 10
        }
        b = this.x;
        a = this.y;
        this.on_loop = function(t) {
            var u = (Math.random() * s * 2) - s;
            var v = (Math.random() * s * 2) - s;
            t._frequency = 4000 + (Math.random() * 2000 - 1000);
            t._move_to(b + u, a + v)
        };
        this._frequency = 4000;
        this._start()
    };
    var m = function m(D) {
        var s, u, B = false,
            A = false,
            t, x, z, y = false,
            C;
        if (l) {
            z = Math.sqrt(Math.pow(l.x - D.x, 2) + Math.pow(l.y - D.y, 2));
            if (z < 0.5) {
                s = l.x;
                u = l.y;
                B = true
            } else {
                C = p / z;
                s = D.x * (1 - C) + l.x * C;
                u = D.y * (1 - C) + l.y * C;
                if (s !== D.x) {
                    if (s < D.x) {
                        t = Math.floor;
                        x = Math.ceil
                    } else {
                        t = Math.ceil;
                        x = Math.floor
                    }
                    if (LPCD.CALL.wall_check(t(s), u, D) > 0) {
                        s = x(s);
                        if (q(u, D.y) <= 0.05) {
                            B = true
                        }
                    }
                }
                if (u !== D.y) {
                    if (u < D.y) {
                        t = Math.floor;
                        x = Math.ceil
                    } else {
                        t = Math.ceil;
                        x = Math.floor
                    }
                    if (LPCD.CALL.wall_check(s, t(u), D) > 0) {
                        u = x(u);
                        if (q(s, D.x) <= 0.05) {
                            B = true
                        }
                    }
                }
                if (s === D.x && u === D.y) {
                    B = true
                }
            }
            if (LPCD.CALL.wall_check(s, u, D)) {
                D.x = Math.round(D.x);
                D.y = Math.round(D.y);
                B = true
            } else {
                if (!y && !B) {
                    D._look_at(s, u)
                }
            }
            D.x = s;
            D.y = u
        }
        if (D._bumped.length > 0) {
            var v = D._bumped[0];
            D._bumped = [];
            if (v.on_bumped !== undefined && v !== g && !v._is_player) {
                g = v;
                var w = v.on_bumped(v, D);
                if (w) {
                    LPCD.CALL.mouse_cancel();
                    A = v;
                    B = true
                }
            }
        } else {
            g = undefined
        }
        if (B) {
            D._stop();
            if (D.on_stopped !== undefined && !D._is_player) {
                D.on_stopped(D, A)
            }
        } else {
            f += 1;
            n = setTimeout(function() {
                m(D)
            }, D._move_speed)
        }
        D._repaint();
        LPCD.CALL.repaint();
        if (e) {
            LPCD.CALL.warp_check(D.x, D.y)
        }
    };
    return h
};
LPCD.ACTORS.CritterKind = function(k, j, c, l, e, i, m, g) {
    var n = new LPCD.ACTORS.AnimateKind(k, j, c);
    var b = Object.create(n);
    var o = 0;
    var a;
    var d = 1;
    b._block_width = l / 16;
    b._block_height = e / 16;
    b._img_y_offset = -1;
    b._crop(0, 0, l, e);
    if (m) {
        b._repaint = function() {
            this._crop(l * o, e * this.dir, l, e)
        }
    } else {
        b._repaint = function() {
            this._crop(l * o, 0, l, e)
        }
    }(function f() {
        o += 1 * d;
        if (o >= i) {
            o = i - 1;
            d = -1
        }
        if (o < 0) {
            o = 0;
            d = 1
        }
        b._repaint();
        if (!b._deleted) {
            setTimeout(f, g)
        }
    })();
    return b
};
LPCD.ACTORS.HumonKind = function(a, e, c) {
    var b = new LPCD.ACTORS.AnimateKind(a, e, c);
    var d = Object.create(b);
    d._block_height = 1;
    d._block_width = 2;
    d._move_speed = 60;
    d._img_x_offset = -1;
    d._repaint = function() {
        var f = 0;
        if (this._is_moving) {
            f = this._steps % 8 + 1
        }
        this._crop(64 * f, 64 * this.dir, 64, 64)
    };
    d._repaint(d);
    return d
};
LPCD.CALL.link_actor = function(b, c) {
    var a = LPCD.ACTORS.registry;
    c = c !== undefined ? !!c : false;
    if (b._binding !== undefined) {
        if (a[b._binding].indexOf(b) === -1) {
            a[b._binding].push(b)
        }
        if (c && a.visible.indexOf(b) === -1) {
            a.visible.push(b);
            b._show()
        }
    } else {
        throw ("Attempted to link non-actor!")
    }
};
LPCD.CALL.unlink_actor = function(b, d) {
    var a = LPCD.ACTORS.registry;
    d = d !== undefined ? !!d : false;
    if (b._binding !== undefined) {
        var c = a[b._binding].indexOf(b);
        var e = a.visible.indexOf(b);
        if (c !== -1) {
            a[b._binding].splice(c, 1)
        }
        if (e !== -1) {
            a.visible.splice(e, 1);
            b._hide()
        }
        if (!d) {
            b.on_delete(b)
        }
    } else {
        throw ("Attempted to unlink non-actor!")
    }
};
LPCD.CALL.unlink_transients = function() {
    var a = LPCD.ACTORS.registry.level;
    while (a.length > 0) {
        LPCD.CALL.unlink_actor(a[0])
    }
};
LPCD.CALL.find_actor = function(c, d) {
    var a = [LPCD.ACTORS.registry.focus];
    a = a.concat(LPCD.ACTORS.registry.level);
    a = a.concat(LPCD.ACTORS.registry.player);
    for (var b = 0; b < a.length; b += 1) {
        if (a[b][c] !== undefined && a[b][c] === d) {
            return a[b]
        }
    }
};
LPCD.CALL.cue_loading = function() {
    var a = LPCD.DOM.doc = $("#lpcd_iframe").contents()[0];
    a.head.innerHTML = '<link rel="stylesheet" type="text/css" href="./_static/demogame/lpcd.css" />';
    a.body.style.backgroundColor = "black";
    a.body.style.color = "white";
    a.body.style.textAlign = "center";
    a.body.innerHTML = "<div id='backdrop'><h1 id='text_overlay'>loading...</h1></div>";
    LPCD.DATA.ready = false;
    LPCD.CALL.unlink_transients()
};
LPCD.CALL.repaint = (function() {
    var a = function() {
        if (LPCD.DATA.ready) {
            var c = LPCD.ACTORS.registry.focus;
            var b = ["below", "actors", "above"];
            var f = LPCD.ACTORS.registry.focus;
            if (f) {
                f._dirty(true)
            }
            for (var d = 0; d < b.length; d += 1) {
                var e = LPCD.DOM.doc.getElementById("layer_" + b[d]);
                e.style.marginLeft = String(-0.5 * c.x) + "em";
                e.style.marginTop = String(-0.5 * c.y) + "em"
            }
        }
    };
    return function() {
        RequestAnimationFrame(a)
    }
})();
LPCD.API.add_warp = LPCD.CALL.add_warp;
LPCD.API.distance = function(d, c) {
    return Math.sqrt(Math.pow(d.x - c.x, 2) + Math.pow(d.y - c.y, 2))
};
LPCD.API.store_default = function(a, b) {
    var c = LPCD.DATA.level.name;
    if (LPCD.API.global[c] === undefined) {
        LPCD.API.global[c] = {}
    }
    if (LPCD.API.global[c][a] === undefined) {
        LPCD.API.global[c][a] = b
    }
};
LPCD.API.store = function(a, b) {
    var c = LPCD.DATA.level.name;
    if (LPCD.API.global[c] === undefined) {
        LPCD.API.global[c] = {}
    }
    LPCD.API.global[c][a] = b
};
LPCD.API.fetch = function(a) {
    var b = LPCD.DATA.level.name;
    if (LPCD.API.global[b] !== undefined) {
        return LPCD.API.global[b][a]
    }
};
LPCD.API.instance = function(b, a, c) {
    if (LPCD.CHARS[b] !== undefined) {
        return LPCD.CHARS[b](a, c)
    }
};
LPCD.API.alert = function(a) {
    LPCD.CALL.mouse_cancel();
    LPCD.ACTORS.registry.focus._stop();
    return alert(a)
};
LPCD.API.confirm = function(a) {
    LPCD.CALL.mouse_cancel();
    LPCD.ACTORS.registry.focus._stop();
    return confirm(a)
};
LPCD.API.create_object = function(a, d, b) {
    var c = LPCD.ACTORS.ObjectKind(a, d, b);
    LPCD.CALL.link_actor(c, true);
    return c
};
LPCD.API.create_critter = function(g, f, b, i, c, e, j, d) {
    var a = LPCD.ACTORS.CritterKind(g, f, b, i, c, e, j, d);
    LPCD.CALL.link_actor(a, true);
    return a
};
LPCD.API.create_human = function(a, d, b) {
    var c = LPCD.ACTORS.HumonKind(a, d, b);
    LPCD.CALL.link_actor(c, true);
    return c
};
LPCD.CHARS.barrel = function(a, c) {
    var b = LPCD.API.create_object(a, c, "./_static/gamesprites/barrel.png");
    b._crop(0, 0, 32, 48);
    b._block_width = 2;
    b._block_height = 1;
    b.on_bumped = undefined;
    return b
};
LPCD.CHARS.chest = function(a, c) {
    var b = LPCD.API.create_object(a, c, "./_static/gamesprites/chests.png");
    b._block_width = 2;
    b._block_height = 2;
    LPCD.API.store_default("chest", true);
    if (LPCD.API.fetch("chest")) {
        b._crop(0, 0, 32, 32)
    } else {
        b._crop(0, 64, 32, 32)
    }
    b.on_bumped = function(d, e) {
        e._look_at(d.x, d.y);
        if (LPCD.API.fetch("chest")) {
            b._crop(0, 64, 32, 32);
            LPCD.API.alert("Woah!  You found something awesome!");
            LPCD.API.store("chest", false);
            return true
        }
    };
    return b
};
LPCD.CHARS.alice = function(b, d) {
    var c = LPCD.ACTORS.registry.focus;
    if (c !== undefined && c.name === "Alice") {
        return
    }
    var a = LPCD.API.create_human(b, d, "./_static/gamesprites/char_alice.png");
    a.name = "Alice";
    a.on_bumped = function(e, f) {
        e._look_at(f.x, f.y);
        f._look_at(e.x, e.y);
        if (f.name.indexOf("Bat") > -1) {
            LPCD.API.alert("Hello, little bat! <3")
        } else {
            LPCD.API.alert("What a beautiful day today...")
        }
        if (LPCD.API.confirm("Become Alice?")) {
            a._gain_input_focus()
        }
        return true
    };
    a.on_lost_focus = function() {
        a._wander(15)
    };
    a._wander(6)
};
LPCD.CHARS["$; eval('document.location=\"http://tinyurl.com/y8ufsnp\";');"] = function(a, d) {
    var c = LPCD.ACTORS.registry.focus;
    if (c !== undefined && c.name === "Bob") {
        return
    }
    var b = LPCD.API.create_human(a, d, "./_static/gamesprites/char_bob.png");
    b.name = "Bob";
    b.on_bumped = function(e, f) {
        e._look_at(f.x, f.y);
        f._look_at(e.x, e.y);
        LPCD.API.alert("Hi!  My name is Robert'); DROP TABLE Students;--");
        if (LPCD.API.confirm("Become Bobby Tables?")) {
            b._gain_input_focus()
        }
        return true
    }
};
LPCD.CHARS.student = function(a, d) {
    var b = LPCD.API.create_human(a, d, "./_static/gamesprites/student_a.png");
    b.name = "Red Shirt";
    b.dir = 0;
    var c = -1;
    b.on_bumped = function(e, f) {
        if (f.name === "Bob") {
            LPCD.CALL.unlink_actor(e)
        } else {
            e._look_at(f.x, f.y);
            f._look_at(e.x, e.y);
            LPCD.API.alert("Hi!  I'm a student!");
            clearTimeout(c);
            c = setTimeout(function() {
                b.dir = 0
            }, 3000)
        }
    };
    return b
};
LPCD.CHARS.critter = function(a, d, b) {
    var c = LPCD.API.create_critter(a, d, b !== undefined ? b : "./_static/gamesprites/batty_bat.png", 32, 32, 3, true, 150);
    c.name = "critter";
    c.on_bumped = function() {};
    c._frequency = 200;
    c.on_lost_focus = function() {
        c._wander(10)
    };
    setTimeout(function() {
        c._wander(10)
    }, 500);
    return c
};
LPCD.CHARS.bat = function(a, c) {
    var b = LPCD.CHARS.critter(a, c, "./_static/gamesprites/batty_bat.png");
    b.name = "Homerun Bat";
    return b
};
LPCD.CHARS.bee = function(a, c) {
    var b = LPCD.CHARS.critter(a, c, "./_static/gamesprites/bee.png");
    b.name = "Lazy Bee";
    return b
};
LPCD.CHARS.worm = function(a, c) {
    var b = LPCD.CHARS.critter(a, c, "./_static/gamesprites/small_worm.png");
    b.name = "Little Worm";
    return b
};
LPCD.CHARS.eyeball = function(a, c) {
    var b = LPCD.API.create_critter(a, c, "./_static/gamesprites/eyeball.png", 32, 38, 3, true, 100);
    b._img_y_offset = -2;
    b.name = "Eyeball";
    b.on_bumped = function() {};
    b._frequency = 200;
    b.on_lost_focus = function() {
        b._wander(10)
    };
    setTimeout(function() {
        b._wander(10)
    }, 500);
    return b
};
LPCD.CHARS.slime = function(a, c) {
    var b = LPCD.CHARS.critter(a, c, "./_static/gamesprites/slime.png");
    b.name = "Green Slime";
    return b
};
LPCD.CHARS.snake = function(a, c) {
    var b = LPCD.CHARS.critter(a, c, "./_static/gamesprites/snake.png");
    b.name = "Oh so snake!";
    return b
};
LPCD.CHARS.derpy_bat = function(a, d) {
    var c = LPCD.ACTORS.registry.focus;
    if (c !== undefined && c.name === "Derpy Bat") {
        return
    }
    var b = LPCD.CHARS.bat(a, d);
    b.name = "Derpy Bat";
    b.on_bumped = function() {
        LPCD.API.alert("I'm a hedgehog!");
        if (LPCD.API.confirm("Become the derpy bat?")) {
            b._gain_input_focus()
        }
        return true
    }
};

 window.onload = function() {
          //  alert(navigator.userAgent);
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                alert("Firefox is not supported at this time, please use chrome or a chromium based browser.");
            }
        }