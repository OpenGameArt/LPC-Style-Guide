
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


 ******************************************************************************/

(function () {
    var ani_timeout = -1;
    window.RequestAnimationFrame = window.RequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        if (ani_timeout === -1) {
            ani_timeout = setTimeout(function(){ callback(); ani_timeout = -1; }, 100/60);
        }
    };  
})();