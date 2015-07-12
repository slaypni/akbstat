(function() {
  var R_NODE, R_NODE_FOCUSED, getGroup,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  getGroup = function(member) {
    if (member['teams'][0] === '研') {
      return member['groups'][0];
    }
    return {
      A: 'AKB48',
      K: 'AKB48',
      B: 'AKB48',
      4: 'AKB48',
      8: 'AKB48',
      S: 'SKE48',
      KII: 'SKE48',
      E: 'SKE48',
      N: 'NMB48',
      M: 'NMB48',
      BII: 'NMB48',
      H: 'HKT48',
      KIV: 'HKT48',
      SII: 'SNH48'
    }[member['teams'][0]];
  };

  R_NODE = 20;

  R_NODE_FOCUSED = !isMobile.any ? 30 : R_NODE;

  $(function() {
    var bg, container_height, container_width, defs, force_general, g_bg_nodes, g_focused_nodes, g_general_nodes, g_nodes, g_overlay, height, left_offset, members, mg, range_margin, svg, top_offset, width;
    width = height = _.max([700, _.min([$(window).width(), $(window).height() - $('#vis').offset().top])]);
    container_width = _.max([width, $(window).width()]);
    container_height = _.max([height, $(window).height() - $('#vis').offset().top]);
    left_offset = (container_width - width) / 2;
    top_offset = (container_height - height) / 2;
    svg = d3.select('#vis>svg').attr({
      'width': container_width,
      'height': container_height
    });
    defs = svg.select('defs');
    bg = svg.append('rect').attr({
      'class': 'background',
      'width': container_width,
      'height': container_height
    });
    g_bg_nodes = svg.append('g').attr('id', 'bg-nodes');
    g_general_nodes = svg.append('g').attr('id', 'general-nodes');
    mg = svg.append('rect').attr({
      'class': 'middleground',
      'width': container_width,
      'height': container_height
    });
    g_focused_nodes = svg.append('g').attr('id', 'focused-nodes');
    g_nodes = svg.selectAll('#general-nodes, #focused-nodes');
    g_overlay = svg.append('g').attr('id', 'overlay');
    (function() {
      $('body').css({
        'width': container_width
      });
      $('#header .container').css({
        'width': $(window).width()
      });
      $('#pop').css({
        'width': $(window).width(),
        'height': $(window).height()
      });
      return $('#pop-bg').css({
        'width': container_width,
        'height': container_height + $('#vis').offset().top
      });
    })();
    $(window).scroll(function() {
      var left_srcoll_offset;
      left_srcoll_offset = Math.min($(this).scrollLeft(), container_width - $(this).width());
      $('#header .container').css('left', left_srcoll_offset);
      $('#pop').css({
        'top': Math.min($(this).scrollTop(), container_height - ($(this).height() - $('#vis').offset().top)),
        'left': left_srcoll_offset
      });
      return $('#description').css('right', -1 * left_srcoll_offset);
    });
    if (isMobile.any) {
      $(window).scrollLeft(Math.max(0, (container_width - $(window).width()) / 2));
    }
    members = [];
    range_margin = R_NODE * 3;
    force_general = d3.layout.force().gravity(0.0).charge(0.0).friction(0.0).nodes([]).size([container_width, container_height]);
    $('.loading').show();
    return d3.json('data/members.json', function(error, _members) {
      var collide, enterFocusMode, enterGeneralMode, force_focus, getTargetMemberIdsFromUrl, is_thumbnail_loaded, member, memberId, scale_x, scale_y, showActivities, skip, thumbnail, tick, updateNodePosition, updateNodePositions, updateNodes, updateUrl;
      if (error) {
        console.warn(error);
      }
      scale_x = d3.scale.linear().range([(container_width - width) / 2 + range_margin, (container_width - width) / 2 + width - range_margin]).domain(d3.extent((_.values(_members)).map(function(member) {
        return member.x[0];
      })));
      scale_y = d3.scale.linear().range([range_margin, height - range_margin]).domain(d3.extent((_.values(_members)).map(function(member) {
        return member.x[1];
      })));
      for (memberId in _members) {
        member = _members[memberId];
        members.push(_.merge(member, {
          'member_id': memberId,
          x: scale_x(member.x[0]),
          y: scale_y(member.x[1]),
          x_original: member.x[0],
          y_original: member.x[1],
          r: R_NODE,
          group: getGroup(member, {
            fixed: false
          })
        }));
      }
      updateNodePosition = function(member) {
        defs.select("#node-thumbnail-" + member['member_id'] + " circle.node-thumbnail").attr({
          'cx': function(member) {
            return member.x;
          },
          'cy': function(member) {
            return member.y;
          }
        });
        defs.select("path.node-name-text#node-name-text-" + member['member_id']).attr({
          'd': function(member) {
            return "m" + (member.x - member.r * 1.1) + "," + member.y + " a" + (member.r * 1.1) + "," + (member.r * 1.1) + " 0 0 1 " + (member.r * 2.2) + ",0";
          }
        });
        g_nodes.select("g.node#node-" + member['member_id'] + " circle.frame").attr({
          'cx': function(member) {
            return member.x;
          },
          'cy': function(member) {
            return member.y;
          }
        });
        g_nodes.select("g.node#node-" + member['member_id'] + " image").attr({
          'x': function(member) {
            return member.x - member.r;
          },
          'y': function(member) {
            return member.y - member.r - (member.r * 2) * member['thumbnail_index'] - (member['thumbnail_offset'] - (thumbnail.height / members.length) * member['thumbnail_index']) * (((member.r * 2) * members.length) / thumbnail.height);
          }
        });
        return g_nodes.select("g.node#node-" + member['member_id'] + " circle.overlay").attr({
          'cx': function(member) {
            return member.x;
          },
          'cy': function(member) {
            return member.y;
          }
        });
      };
      updateNodePositions = function() {
        var node_circles;
        node_circles = svg.selectAll("defs circle.node-thumbnail,\ng.node circle.frame,\ng.node circle.overlay\n" + (!_.some(members, 'focused') ? ', g.bg-node circle' : ''));
        defs.selectAll('path.node-name-text').attr({
          'd': function(member) {
            return "m" + (member.x - member.r * 1.1) + "," + member.y + " a" + (member.r * 1.1) + "," + (member.r * 1.1) + " 0 0 1 " + (member.r * 2.2) + ",0";
          }
        });
        if (is_thumbnail_loaded) {
          g_nodes.selectAll('g.node image').attr({
            'x': function(member) {
              return member.x - member.r;
            },
            'y': function(member) {
              return member.y - member.r - (member.r * 2) * member['thumbnail_index'] - (member['thumbnail_offset'] - (thumbnail.height / members.length) * member['thumbnail_index']) * (((member.r * 2) * members.length) / thumbnail.height);
            }
          });
        }
        return node_circles.attr({
          'cx': function(member) {
            return member.x;
          },
          'cy': function(member) {
            return member.y;
          }
        });
      };
      updateNodes = function(update_positions) {
        var g;
        if (update_positions == null) {
          update_positions = true;
        }
        defs.selectAll('circle.node-thumbnail').attr({
          'r': function(member) {
            return member.r;
          }
        });
        g = g_nodes.selectAll('g.node').data(members, function(member) {
          return member['member_id'];
        }).classed('AKB48', function(member) {
          return 'AKB48' === member.group;
        }).classed('SKE48', function(member) {
          return 'SKE48' === member.group;
        }).classed('NMB48', function(member) {
          return 'NMB48' === member.group;
        }).classed('HKT48', function(member) {
          return 'HKT48' === member.group;
        }).classed('SNH48', function(member) {
          return 'SNH48' === member.group;
        }).classed('selected', function(member) {
          return member.selected;
        });
        g.select('circle.frame').attr({
          'r': function(member) {
            return member.r;
          }
        });
        g.select('image').attr({
          'width': function(member) {
            return member.r * 2;
          },
          'height': function(member) {
            return members.length * member.r * 2;
          },
          'xlink:href': function(member) {
            return 'images/thumbnails.png';
          },
          'clip-path': function(member) {
            return "url(#node-thumbnail-" + member['member_id'] + ")";
          }
        });
        g.select('circle.overlay').attr({
          'r': function(member) {
            return member.r;
          }
        });
        g = g_overlay.selectAll('g.node-overlay').data(members, function(member) {
          return member['member_id'];
        }).classed('AKB48', function(member) {
          return 'AKB48' === member.group;
        }).classed('SKE48', function(member) {
          return 'SKE48' === member.group;
        }).classed('NMB48', function(member) {
          return 'NMB48' === member.group;
        }).classed('HKT48', function(member) {
          return 'HKT48' === member.group;
        }).classed('SNH48', function(member) {
          return 'SNH48' === member.group;
        });
        g.select('text.name:not(.frame)').attr('uuu', function(member) {
          return "" + member['member_id'];
        }).select('.textpath').attr({
          'xlink:href': function(member) {
            return "#node-name-text-" + member['member_id'];
          }
        }).text(function(member) {
          return member['name'];
        });
        g.select('text.name.frame').attr('uuu', function(member) {
          return "" + member['member_id'];
        }).select('.textpath').attr({
          'xlink:href': function(member) {
            return "#node-name-text-" + member['member_id'];
          }
        }).text(function(member) {
          return member['name'];
        });
        g_bg_nodes.selectAll('g.bg-node').data(members, function(member) {
          return member['member_id'];
        }).classed('AKB48', function(member) {
          return 'AKB48' === member.group;
        }).classed('SKE48', function(member) {
          return 'SKE48' === member.group;
        }).classed('NMB48', function(member) {
          return 'NMB48' === member.group;
        }).classed('HKT48', function(member) {
          return 'HKT48' === member.group;
        }).classed('SNH48', function(member) {
          return 'SNH48' === member.group;
        }).select('circle').attr({
          'r': function(member) {
            return member.r * 4;
          }
        });
        if (update_positions) {
          return updateNodePositions();
        }
      };
      thumbnail = new Image();
      is_thumbnail_loaded = false;
      (function() {
        var g, node, node_overlay;
        thumbnail.onload = function() {
          d3.selectAll('g.node').classed('img-loaded', true);
          is_thumbnail_loaded = true;
          updateNodePositions();
          return $('.loading').hide();
        };
        thumbnail.src = "images/thumbnails.png";
        defs.selectAll('clipPath.node-thumbnail').data(members, function(member) {
          return member['member_id'];
        }).enter().append('clipPath').attr({
          'id': function(member) {
            return "node-thumbnail-" + member['member_id'];
          },
          'class': 'node-thumbnail'
        }).append('circle').attr({
          'class': 'node-thumbnail'
        });
        defs.selectAll('path.node-name-text').data(members, function(member) {
          return member['member_id'];
        }).enter().append('path').attr({
          'id': function(member) {
            return "node-name-text-" + member['member_id'];
          },
          'class': 'node-name-text'
        });
        g_bg_nodes.selectAll('g.bg-node').data(members, function(member) {
          return member['member_id'];
        }).enter().append('g').attr({
          'id': function(member) {
            return "bg-node-" + member['member_id'];
          },
          'class': 'bg-node'
        }).append('circle');
        node = g_general_nodes.selectAll('g.node').data(members, function(member) {
          return member['member_id'];
        });
        g = node.enter().append('g').attr({
          'id': function(member) {
            return "node-" + member['member_id'];
          },
          'class': 'node'
        });
        g.append('circle').attr({
          'class': 'frame'
        });
        g.append('image');
        g.append('circle').attr({
          'class': 'overlay'
        }).on('click', function(member) {
          if (member.selected) {
            return enterGeneralMode();
          } else if (member.focused) {
            return typeof showActivities === "function" ? showActivities(member) : void 0;
          } else {
            return enterFocusMode(member);
          }
        }).on('mouseenter', function(member) {
          return d3.selectAll("g#node-overlay-" + member['member_id'] + " text.name").style({
            'display': 'block'
          });
        }).on('mouseleave', function(member) {
          return d3.selectAll("g#node-overlay-" + member['member_id'] + " text.name").style({
            'display': null
          });
        });
        node_overlay = g_overlay.selectAll('g.node-overlay').data(members, function(member) {
          return member['member_id'];
        });
        g = node_overlay.enter().append('g').attr({
          'id': function(member) {
            return "node-overlay-" + member['member_id'];
          },
          'class': 'node-overlay'
        });
        g.append('text').attr({
          'class': 'name frame'
        }).append('textPath').attr({
          'class': 'textpath',
          'startOffset': '50%'
        });
        g.append('text').attr({
          'class': 'name'
        }).append('textPath').attr({
          'class': 'textpath',
          'startOffset': '50%'
        });
        return updateNodes();
      })();
      collide = function(_members, space) {
        var k, len, mx1, mx2, my1, my2, q, results;
        if (_members == null) {
          _members = members;
        }
        if (space == null) {
          space = 2;
        }
        q = d3.geom.quadtree(_members);
        results = [];
        for (k = 0, len = _members.length; k < len; k++) {
          member = _members[k];
          mx1 = member.x - member.r;
          mx2 = member.x + member.r;
          my1 = member.y - member.r;
          my2 = member.y + member.r;
          if (mx1 < left_offset) {
            member.x = left_offset + member.r;
            mx1 = left_offset;
            mx2 = left_offset + member.r * 2;
          }
          if (mx2 > left_offset + width) {
            member.x = left_offset + width - member.r;
            mx1 = left_offset + width - member.r * 2;
            mx2 = left_offset + width;
          }
          if (my1 < top_offset) {
            member.y = top_offset + member.r;
            my1 = top_offset;
            my2 = top_offset + member.r * 2;
          }
          if (my2 > top_offset + height) {
            member.y = top_offset + height - member.r;
            my1 = top_offset + height - member.r * 2;
            my2 = top_offset + height;
          }
          results.push(q.visit(function(node, x1, y1, x2, y2) {
            var d, r, x, y;
            if ((node.point != null) && node.point !== member) {
              x = member.x - node.point.x;
              y = member.y - node.point.y;
              d = Math.sqrt(x * x + y * y);
              r = member.r + node.point.r + space;
              if (d < r) {
                d = (d - r) / d * 0.5;
                x *= d;
                y *= d;
                member.x -= x;
                member.y -= y;
                node.point.x += x;
                node.point.y += y;
              }
            }
            return x1 > mx2 || x2 < mx1 || y1 > my2 || y2 < my1;
          }));
        }
        return results;
      };
      tick = 0;
      skip = isMobile.any ? 40 : 2;
      force_general.start().alpha(0.0075);
      force_general.on('tick', function() {
        collide();
        if (++tick % skip === 0 && is_thumbnail_loaded) {
          return updateNodePositions();
        }
      });
      force_focus = d3.layout.force().gravity(0.0).friction(0.5).size([container_width, container_height]);
      enterGeneralMode = function() {
        var k, len, selector, showActivities;
        force_focus.stop();
        showActivities = null;
        mg.classed('focus-mode', false);
        $("g#focused-nodes g.node").detach().appendTo('g#general-nodes');
        for (k = 0, len = members.length; k < len; k++) {
          member = members[k];
          member.focused = member.selected = member.fixed = false;
          member.r = R_NODE;
          delete member['px'];
          delete member['py'];
        }
        updateNodes(false);
        selector = ((members.filter(function(member) {
          return member['general_mode_positions'] != null;
        })).map(function(member) {
          return "g.node#node-" + member['member_id'];
        })).join(',');
        g_nodes.selectAll(selector).transition().duration(200).tween('position', function(member) {
          var dest_x, dest_y, ref1, ref2, src_x, src_y;
          ref1 = [member.x, member.y], src_x = ref1[0], src_y = ref1[1];
          ref2 = [member['general_mode_positions'].x, member['general_mode_positions'].y], dest_x = ref2[0], dest_y = ref2[1];
          return function(t) {
            member.x = (1 - t) * src_x + t * dest_x;
            member.y = (1 - t) * src_y + t * dest_y;
            return updateNodePosition(member);
          };
        }).each('end', function(member) {
          if (!member.focused) {
            delete member['general_mode_positions'];
          }
          if (!_.some(members, 'general_mode_positions')) {
            return force_general.start().alpha(0.0075);
          }
        });
        return updateUrl();
      };
      showActivities = null;
      enterFocusMode = function(target_member, update_url, callback) {
        var k, len;
        if (update_url == null) {
          update_url = true;
        }
        if (callback == null) {
          callback = null;
        }
        for (k = 0, len = members.length; k < len; k++) {
          member = members[k];
          member.focused = member.selected = member.fixed = false;
        }
        $('.loading').show();
        d3.json("data/references/" + target_member['member_id'] + ".json", function(error, ref) {
          var focused_members, l, len1, len2, len3, n, o, ref1, ref2, ref_member_ids;
          $('.loading').hide();
          force_general.stop();
          $("g#focused-nodes g.node").detach().appendTo('g#general-nodes');
          ref_member_ids = _.keys(ref['ref_activity_ids']);
          for (l = 0, len1 = members.length; l < len1; l++) {
            member = members[l];
            member.focused = (ref1 = member['member_id'], indexOf.call(ref_member_ids, ref1) >= 0) || member['member_id'] === target_member['member_id'];
            member.selected = member['member_id'] === target_member['member_id'];
            member.r = member['member_id'] === target_member['member_id'] ? R_NODE_FOCUSED : R_NODE;
          }
          focused_members = members.filter(function(member) {
            return member.focused && !member.selected;
          });
          g_nodes.select("g.node#node-" + target_member['member_id'] + " circle.overlay").transition().duration(350).attrTween('r', function(member) {
            return function(t) {
              return member.r * (1 - 0.04 * Math.sin(t * 2 * Math.PI));
            };
          });
          for (n = 0, len2 = focused_members.length; n < len2; n++) {
            member = focused_members[n];
            $("g#node-" + member['member_id']).detach().appendTo('g#focused-nodes');
          }
          $("g#node-" + target_member['member_id']).detach().appendTo('g#focused-nodes');
          mg.classed('focus-mode', true);
          updateNodes();
          ref2 = focused_members.concat([target_member]);
          for (o = 0, len3 = ref2.length; o < len3; o++) {
            member = ref2[o];
            if (member['general_mode_positions'] == null) {
              member['general_mode_positions'] = {
                x: member['x'],
                y: member['y']
              };
            }
          }
          target_member.fixed = true;
          if (!isMobile.any) {
            force_focus.nodes(focused_members.concat([target_member])).links((function() {
              var len4, p, results;
              results = [];
              for (p = 0, len4 = focused_members.length; p < len4; p++) {
                member = focused_members[p];
                results.push({
                  source: target_member,
                  target: member
                });
              }
              return results;
            })()).linkStrength(function(link) {
              return _.min([1, (Math.pow(ref.scores[link.target['member_id']], 1)) * 5]);
            }).linkDistance(75).on('start', function() {
              var j, render, ticks_incremented, ticks_per_render;
              ticks_per_render = 10;
              ticks_incremented = 1;
              j = 0;
              render = function() {
                var i, p, ref3;
                for (i = p = 0, ref3 = ticks_per_render + j; 0 <= ref3 ? p < ref3 : p > ref3; i = 0 <= ref3 ? ++p : --p) {
                  force_focus.tick();
                  if (i % 2 === 0) {
                    collide(focused_members.concat([target_member]), 4);
                  }
                }
                j += ticks_incremented;
                target_member = _.merge(target_member, target_member['general_mode_positions']);
                if (is_thumbnail_loaded) {
                  updateNodePositions();
                }
                if (force_focus.alpha() > 0) {
                  return requestAnimationFrame(render);
                }
              };
              return requestAnimationFrame(render);
            }).start().alpha(0.015);
          }
          showActivities = function(member, update_url) {
            var activity, activity_id, date, len4, p, ref3;
            if (update_url == null) {
              update_url = true;
            }
            mg.classed('focus-mode', false);
            $('#pop, #pop-bg').addClass('active').scrollTop(0);
            $('#pop-cards').empty();
            $('#pop-cards').append($("<div class=\"card head\">\n  <div class=\"left\">\n    <div class=\"thumbnail\">\n      <a href=\"https://plus.google.com/" + target_member['member_id'] + "\" target=\"_blank\">\n        <img src=\"images/node_thumbnail/" + target_member['thumbnail'] + "\">\n      </a>\n    </div>\n    <span class=\"head-name\">\n      <a href=\"https://plus.google.com/" + target_member['member_id'] + "\" target=\"_blank\">\n        " + target_member['name'] + "\n      </a>\n    </span>\n  </div>\n  <div class=\"right\">\n    <div class=\"thumbnail\">\n      <a href=\"https://plus.google.com/" + member['member_id'] + "\" target=\"_blank\">\n        <img src=\"images/node_thumbnail/" + member['thumbnail'] + "\">\n      </a>\n    </div>\n    <span class=\"head-name\">\n      <a href=\"https://plus.google.com/" + member['member_id'] + "\" target=\"_blank\">\n        " + member['name'] + "\n      </a>\n    </span>\n  </div>\n</div>"));
            ref3 = ref['ref_activity_ids'][member['member_id']];
            for (p = 0, len4 = ref3.length; p < len4; p++) {
              activity_id = ref3[p];
              activity = ref['activities'][activity_id];
              date = new Date(activity['published']);
              $('#pop-cards').append($("<div class=\"card\">\n  <a class=\"external-link\" href=\"" + activity['url'] + "\" target=\"_blank\">\n    <i class=\"fa fa-external-link\"></i>\n  </a>\n  <div class=\"header\">\n    <div class=\"thumbnail\">\n      <a href=\"https://plus.google.com/" + target_member['member_id'] + "\" target=\"_blank\">\n        <img src=\"images/node_thumbnail/" + target_member['thumbnail'] + "\">\n      </a>\n    </div>\n    <div class=\"inner-header\">\n      <div class=\"name\">\n          <a href=\"https://plus.google.com/" + target_member['member_id'] + "\" target=\"_blank\">\n            " + target_member['name'] + "\n          </a>\n        </div>\n      <div class=\"time\">" + (date.getUTCFullYear()) + "/" + (date.getUTCMonth() + 1) + "/" + (date.getUTCDate()) + "</div>\n    </div>\n  </div>\n  <div class=\"message\">" + (activity['content'].replace(/\n/g, '<br>')) + "</div>\n</div>"));
            }
            $('.card').on('click', function(e) {
              return e.stopPropagation();
            });
            $('#pop').one('click', function() {
              return $('#pop').addClass('closing').one('animationend webkitAnimationEnd MSAnimationEnd oanimationend', function(e) {
                mg.classed('focus-mode', true);
                $('#pop, #pop-bg').removeClass('active').removeClass('closing');
                return updateUrl(target_member);
              });
            });
            if (isMobile.any) {
              $('#pop').css({
                'height': $(window).height()
              });
              $('#pop-bg').css({
                'height': container_height + $('#vis').offset().top
              });
            }
            if (update_url) {
              return updateUrl(target_member, member);
            }
          };
          if (update_url) {
            updateUrl(target_member);
          }
          return typeof callback === "function" ? callback() : void 0;
        });
        return mg.on('click', enterGeneralMode);
      };
      updateUrl = function(target_member, referred_member) {
        if (target_member == null) {
          target_member = null;
        }
        if (referred_member == null) {
          referred_member = null;
        }
        return window.history.replaceState({}, '', (target_member != null ? ("#/" + target_member['member_id']) + (referred_member != null ? "/" + referred_member['member_id'] : '') : ' '));
      };
      getTargetMemberIdsFromUrl = function() {
        var m;
        m = window.location.hash.match(/#\/(\w+)(\/(\w+))?\/?/);
        return {
          'target_member_id': m != null ? m[1] : void 0,
          'referred_member_id': m != null ? m[3] : void 0
        };
      };
      return (function() {
        var default_referred_member_id, default_target_member_id, ref1, target_member;
        ref1 = getTargetMemberIdsFromUrl(), default_target_member_id = ref1['target_member_id'], default_referred_member_id = ref1['referred_member_id'];
        if (default_target_member_id == null) {
          return;
        }
        target_member = (members.filter(function(member) {
          return member['member_id'] === default_target_member_id;
        }))[0];
        if (target_member == null) {
          updateUrl();
          return;
        }
        return enterFocusMode(target_member, false, function() {
          var referred_member;
          referred_member = (members.filter(function(member) {
            return member['member_id'] === default_referred_member_id;
          }))[0];
          if ((referred_member != null ? referred_member.focused : void 0) && !(referred_member != null ? referred_member.selected : void 0)) {
            showActivities(referred_member, false);
          }
          return updateUrl(target_member, referred_member);
        });
      })();
    });
  });

}).call(this);

//# sourceMappingURL=../_sourcemaps/mentions/index.js.map