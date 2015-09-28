// �萔
var FPS = 30;                   // �t���[�����[�g
var SCREEN_SIZE = 500;          // ��ʃT�C�Y
var NUM_BOIDS = 100;            // �{�C�h�̐�
var BOID_SIZE = 5;              // �{�C�h�̑傫��
var MAX_SPEED = 7;              // �{�C�h�̍ő呬�x
var canvas = document.getElementById('world');
var ctx = canvas.getContext('2d');
var boids = [];                 // �{�C�h


window.onload = function() {
    /* ������ */
    canvas.width = canvas.height = SCREEN_SIZE;
    ctx.fillStyle = "rgba(33, 33, 33, 0.8)"; // �{�C�h�̐F
    for (var i=0; i<NUM_BOIDS; ++i) {
        boids[i] = {
            x: Math.random()*SCREEN_SIZE, // x���W
            y: Math.random()*SCREEN_SIZE, // y���W
            vx: 0,                        // x�����̑��x
            vy: 0                         // y�����̑��x
        }
    }
    /* ���[�v�J�n */
    setInterval(simulate, 1000/FPS);
};

/**
 * �V�~�����[�g
 */
var simulate = function() {
    draw();                     // �{�C�h�̕`��
    move();                     // �{�C�h�̍��W�̍X�V
};

/**
 * �{�C�h�̕`��
 */
var draw = function() {
    ctx.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE); // ��ʂ��N���A
    // �S�Ẵ{�C�h�̕`��
    for (var i=0,len=boids.length; i<len; ++i) {
        ctx.fillRect(boids[i].x-BOID_SIZE/2, boids[i].y-BOID_SIZE/2, BOID_SIZE, BOID_SIZE);
    }
};

/**
 * �{�C�h�̈ʒu�̍X�V
 */
var move = function() {
    for (var i=0,len=boids.length; i<len; ++i) {
        // ���[����K�p���đ�����ύX
        rule1(i);    // �߂��̌Q��̐^�񒆂Ɍ��������Ƃ���
        rule2(i);    // �{�C�h�͑��̃{�C�h�Ƌ�������낤�Ƃ���
        rule3(i);    // �{�C�h�͑��̃{�C�h�̕��ϑ��x�ɍ��킹�悤�Ƃ���
        // limit speed
        var b = boids[i];
        var speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
        if (speed >= MAX_SPEED) {
            var r = MAX_SPEED / speed;
            b.vx *= r;
            b.vy *= r;
        }
        // �ǂ̊O�ɏo�Ă��܂����ꍇ���x������֌�����
        if (b.x<0 && b.vx<0 || b.x>SCREEN_SIZE && b.vx>0) b.vx *= -1;
        if (b.y<0 && b.vy<0 || b.y>SCREEN_SIZE && b.vy>0) b.vy *= -1;
        // ���W�̍X�V
        b.x += b.vx;
        b.y += b.vy;
    }    
};

/**
 * ���[��1: �{�C�h�͋߂��ɑ��݂���Q��̒��S�Ɍ��������Ƃ���
 */
var rule1 = function(index) {
    var c = {x: 0, y:0};        // �������������Q��̐^��
    for (var i=0,len=boids.length; i<len; ++i) {
        if (i != index) {
            c.x += boids[i].x;
            c.y += boids[i].y;
        }
    }
    c.x /= boids.length - 1;
    c.y /= boids.length - 1;
    boids[index].vx += (c.x-boids[index].x) / 100;
    boids[index].vy += (c.y-boids[index].y) / 100;
};

/**
 * ���[��2: �{�C�h�ׂ͗̃{�C�h�Ƃ�����Ƃ����������Ƃ낤�Ƃ���
 */
var rule2 = function(index) {
    for (var i=0,len=boids.length; i<len; ++i) {
        if (i != index) {
            var d = getDistance(boids[i], boids[index]); // �{�C�h�Ԃ̋���
            if (d < 5) {
                boids[index].vx -= boids[i].x - boids[index].x;
                boids[index].vy -= boids[i].y - boids[index].y;
            }
        }
    }
};

/**
 * ���[��3: �{�C�h�͋߂��̃{�C�h�̕��ϑ��x�ɍ��킹�悤�Ƃ���
 */
var rule3 = function(index) {
    var pv = {x: 0, y: 0};      // �������������Q��̕��ϑ��x
    for (var i=0,len=boids.length; i<len; ++i) {
        if (i != index) {
            pv.x += boids[i].vx;
            pv.y += boids[i].vy;
        }

    }
    pv.x /= boids.length - 1;
    pv.y /= boids.length - 1;
    boids[index].vx += (pv.x-boids[index].vx) / 8;
    boids[index].vy += (pv.y-boids[index].vy) / 8;
};

/**
 * 2�̃{�C�h�Ԃ̋���
 */
var getDistance = function(b1, b2) {
    var x = b1.x - b2.x;
    var y = b1.y - b2.y;
    return Math.sqrt(x*x + y*y);
};