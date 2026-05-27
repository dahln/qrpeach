(function (global) {
  'use strict';

  // ----------------------------------------------------------------------------
  // Core QR Specification Tables
  // ----------------------------------------------------------------------------
  // This distribution file embeds the static QR specification data directly so
  // callers do not need an additional sidecar data file at runtime.
  //
  // Each row in `versionData` follows this layout:
  // [version, total codewords, L data, M data, Q data, H data,
  //  numeric capacity, alphanumeric capacity, binary capacity, kanji capacity]
  //
  // Data source notes are documented in the repository `sources.html` page.
  const versionData = [
    [1, 26, 19, 16, 13, 9, 41, 25, 17, 10],
    [2, 44, 34, 28, 22, 16, 77, 47, 32, 20],
    [3, 70, 55, 44, 34, 26, 127, 77, 53, 32],
    [4, 100, 80, 64, 48, 36, 187, 114, 78, 48],
    [5, 134, 108, 86, 62, 46, 255, 154, 106, 65],
    [6, 172, 136, 108, 76, 60, 322, 195, 134, 82],
    [7, 196, 156, 124, 88, 66, 370, 224, 154, 95],
    [8, 242, 194, 154, 110, 86, 461, 279, 192, 118],
    [9, 292, 232, 182, 132, 100, 552, 335, 230, 141],
    [10, 346, 274, 216, 154, 122, 652, 395, 271, 167],
    [11, 404, 324, 254, 180, 140, 772, 468, 321, 198],
    [12, 466, 370, 290, 206, 158, 883, 535, 367, 226],
    [13, 532, 428, 334, 244, 180, 1022, 619, 425, 262],
    [14, 581, 461, 365, 261, 197, 1101, 667, 458, 282],
    [15, 655, 523, 415, 295, 223, 1250, 758, 520, 320],
    [16, 733, 589, 453, 325, 253, 1408, 854, 586, 361],
    [17, 815, 647, 507, 367, 283, 1548, 938, 644, 397],
    [18, 901, 721, 563, 397, 313, 1725, 1046, 718, 442],
    [19, 991, 795, 627, 445, 341, 1903, 1153, 792, 488],
    [20, 1085, 861, 669, 485, 385, 2061, 1249, 858, 528],
    [21, 1156, 932, 714, 512, 406, 2232, 1352, 929, 572],
    [22, 1258, 1006, 782, 568, 442, 2409, 1460, 1003, 618],
    [23, 1364, 1094, 860, 614, 464, 2620, 1588, 1091, 672],
    [24, 1474, 1174, 914, 664, 514, 2812, 1704, 1171, 721],
    [25, 1588, 1276, 1000, 718, 538, 3057, 1853, 1273, 784],
    [26, 1706, 1370, 1062, 754, 596, 3283, 1990, 1367, 842],
    [27, 1828, 1468, 1128, 808, 628, 3517, 2132, 1465, 902],
    [28, 1921, 1531, 1193, 871, 661, 3669, 2223, 1528, 940],
    [29, 2051, 1631, 1267, 911, 701, 3909, 2369, 1628, 1002],
    [30, 2185, 1735, 1373, 985, 745, 4158, 2520, 1732, 1066],
    [31, 2323, 1843, 1455, 1033, 793, 4417, 2677, 1840, 1132],
    [32, 2465, 1955, 1541, 1115, 845, 4686, 2840, 1952, 1201],
    [33, 2611, 2071, 1631, 1171, 901, 4965, 3009, 2068, 1273],
    [34, 2761, 2191, 1725, 1231, 961, 5253, 3183, 2188, 1347],
    [35, 2876, 2306, 1812, 1286, 986, 5529, 3351, 2303, 1417],
    [36, 3034, 2434, 1914, 1354, 1054, 5836, 3537, 2431, 1499],
    [37, 3196, 2566, 1992, 1426, 1096, 6153, 3729, 2563, 1579],
    [38, 3362, 2702, 2102, 1502, 1142, 6479, 3927, 2699, 1663],
    [39, 3532, 2812, 2216, 1582, 1222, 6743, 4087, 2809, 1730],
    [40, 3706, 2956, 2334, 1666, 1276, 7089, 4296, 3057, 1882]
  ];

  // Alignment pattern center coordinates for each version.
  // Version 1 intentionally has no alignment centers.
  const alignCenters = {
    1: [],
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
    6: [6, 34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
    11: [6, 30, 54],
    12: [6, 32, 58],
    13: [6, 34, 62],
    14: [6, 26, 46, 66],
    15: [6, 26, 48, 70],
    16: [6, 26, 50, 74],
    17: [6, 30, 54, 78],
    18: [6, 30, 56, 82],
    19: [6, 30, 58, 86],
    20: [6, 34, 62, 90],
    21: [6, 28, 50, 72, 94],
    22: [6, 26, 50, 74, 98],
    23: [6, 30, 54, 78, 102],
    24: [6, 28, 54, 80, 106],
    25: [6, 32, 58, 84, 110],
    26: [6, 30, 58, 86, 114],
    27: [6, 34, 62, 90, 118],
    28: [6, 26, 50, 74, 98, 122],
    29: [6, 30, 54, 78, 102, 126],
    30: [6, 26, 52, 78, 104, 130],
    31: [6, 30, 56, 82, 108, 134],
    32: [6, 34, 60, 86, 112, 138],
    33: [6, 30, 58, 86, 114, 142],
    34: [6, 34, 62, 90, 118, 146],
    35: [6, 30, 54, 78, 102, 126, 150],
    36: [6, 24, 50, 76, 102, 128, 154],
    37: [6, 28, 54, 80, 106, 132, 158],
    38: [6, 32, 58, 84, 110, 136, 162],
    39: [6, 26, 54, 82, 110, 138, 166],
    40: [6, 30, 58, 86, 114, 142, 170]
  };

  // Remainder bits appended after all interleaved data and ECC codewords.
  // Index 1..40 maps to version 1..40. Index 0 is an unused placeholder.
  const remainderBits = [
    0, 7, 7, 7, 7, 7, 0, 0, 0, 0,
    0, 0, 0, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 3, 3, 3,
    3, 3, 3, 3, 0, 0, 0, 0, 0, 0
  ];

  // Reed-Solomon block structure lifted into a flat, inspectable table so the
  // runtime can rebuild grouped blocks without any external dataset.
  const rsBlockRows = [
    { versionEcc: '1-L', dataCodewords: 19, ecCodewordsPerBlock: 7, group1Blocks: 1, group1DataCodewords: 19, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '1-M', dataCodewords: 16, ecCodewordsPerBlock: 10, group1Blocks: 1, group1DataCodewords: 16, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '1-Q', dataCodewords: 13, ecCodewordsPerBlock: 13, group1Blocks: 1, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '1-H', dataCodewords: 9, ecCodewordsPerBlock: 17, group1Blocks: 1, group1DataCodewords: 9, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '2-L', dataCodewords: 34, ecCodewordsPerBlock: 10, group1Blocks: 1, group1DataCodewords: 34, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '2-M', dataCodewords: 28, ecCodewordsPerBlock: 16, group1Blocks: 1, group1DataCodewords: 28, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '2-Q', dataCodewords: 22, ecCodewordsPerBlock: 22, group1Blocks: 1, group1DataCodewords: 22, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '2-H', dataCodewords: 16, ecCodewordsPerBlock: 28, group1Blocks: 1, group1DataCodewords: 16, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '3-L', dataCodewords: 55, ecCodewordsPerBlock: 15, group1Blocks: 1, group1DataCodewords: 55, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '3-M', dataCodewords: 44, ecCodewordsPerBlock: 26, group1Blocks: 1, group1DataCodewords: 44, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '3-Q', dataCodewords: 34, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 17, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '3-H', dataCodewords: 26, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '4-L', dataCodewords: 80, ecCodewordsPerBlock: 20, group1Blocks: 1, group1DataCodewords: 80, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '4-M', dataCodewords: 64, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 32, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '4-Q', dataCodewords: 48, ecCodewordsPerBlock: 26, group1Blocks: 2, group1DataCodewords: 24, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '4-H', dataCodewords: 36, ecCodewordsPerBlock: 16, group1Blocks: 4, group1DataCodewords: 9, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '5-L', dataCodewords: 108, ecCodewordsPerBlock: 26, group1Blocks: 1, group1DataCodewords: 108, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '5-M', dataCodewords: 86, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 43, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '5-Q', dataCodewords: 62, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 15, group2Blocks: 2, group2DataCodewords: 16 },
    { versionEcc: '5-H', dataCodewords: 46, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 11, group2Blocks: 2, group2DataCodewords: 12 },
    { versionEcc: '6-L', dataCodewords: 136, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 68, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '6-M', dataCodewords: 108, ecCodewordsPerBlock: 16, group1Blocks: 4, group1DataCodewords: 27, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '6-Q', dataCodewords: 76, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 19, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '6-H', dataCodewords: 60, ecCodewordsPerBlock: 28, group1Blocks: 4, group1DataCodewords: 15, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '7-L', dataCodewords: 156, ecCodewordsPerBlock: 20, group1Blocks: 2, group1DataCodewords: 78, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '7-M', dataCodewords: 124, ecCodewordsPerBlock: 18, group1Blocks: 4, group1DataCodewords: 31, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '7-Q', dataCodewords: 88, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 14, group2Blocks: 4, group2DataCodewords: 15 },
    { versionEcc: '7-H', dataCodewords: 66, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 13, group2Blocks: 1, group2DataCodewords: 14 },
    { versionEcc: '8-L', dataCodewords: 194, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 97, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '8-M', dataCodewords: 154, ecCodewordsPerBlock: 22, group1Blocks: 2, group1DataCodewords: 38, group2Blocks: 2, group2DataCodewords: 39 },
    { versionEcc: '8-Q', dataCodewords: 110, ecCodewordsPerBlock: 22, group1Blocks: 4, group1DataCodewords: 18, group2Blocks: 2, group2DataCodewords: 19 },
    { versionEcc: '8-H', dataCodewords: 86, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 14, group2Blocks: 2, group2DataCodewords: 15 },
    { versionEcc: '9-L', dataCodewords: 232, ecCodewordsPerBlock: 30, group1Blocks: 2, group1DataCodewords: 116, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '9-M', dataCodewords: 182, ecCodewordsPerBlock: 22, group1Blocks: 3, group1DataCodewords: 36, group2Blocks: 2, group2DataCodewords: 37 },
    { versionEcc: '9-Q', dataCodewords: 132, ecCodewordsPerBlock: 20, group1Blocks: 4, group1DataCodewords: 16, group2Blocks: 4, group2DataCodewords: 17 },
    { versionEcc: '9-H', dataCodewords: 100, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 12, group2Blocks: 4, group2DataCodewords: 13 },
    { versionEcc: '10-L', dataCodewords: 274, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 68, group2Blocks: 2, group2DataCodewords: 69 },
    { versionEcc: '10-M', dataCodewords: 216, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 43, group2Blocks: 1, group2DataCodewords: 44 },
    { versionEcc: '10-Q', dataCodewords: 154, ecCodewordsPerBlock: 24, group1Blocks: 6, group1DataCodewords: 19, group2Blocks: 2, group2DataCodewords: 20 },
    { versionEcc: '10-H', dataCodewords: 122, ecCodewordsPerBlock: 28, group1Blocks: 6, group1DataCodewords: 15, group2Blocks: 2, group2DataCodewords: 16 },
    { versionEcc: '11-L', dataCodewords: 324, ecCodewordsPerBlock: 20, group1Blocks: 4, group1DataCodewords: 81, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '11-M', dataCodewords: 254, ecCodewordsPerBlock: 30, group1Blocks: 1, group1DataCodewords: 50, group2Blocks: 4, group2DataCodewords: 51 },
    { versionEcc: '11-Q', dataCodewords: 180, ecCodewordsPerBlock: 28, group1Blocks: 4, group1DataCodewords: 22, group2Blocks: 4, group2DataCodewords: 23 },
    { versionEcc: '11-H', dataCodewords: 140, ecCodewordsPerBlock: 24, group1Blocks: 3, group1DataCodewords: 12, group2Blocks: 8, group2DataCodewords: 13 },
    { versionEcc: '12-L', dataCodewords: 370, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 92, group2Blocks: 2, group2DataCodewords: 93 },
    { versionEcc: '12-M', dataCodewords: 290, ecCodewordsPerBlock: 22, group1Blocks: 6, group1DataCodewords: 36, group2Blocks: 2, group2DataCodewords: 37 },
    { versionEcc: '12-Q', dataCodewords: 206, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 20, group2Blocks: 6, group2DataCodewords: 21 },
    { versionEcc: '12-H', dataCodewords: 158, ecCodewordsPerBlock: 28, group1Blocks: 7, group1DataCodewords: 14, group2Blocks: 4, group2DataCodewords: 15 },
    { versionEcc: '13-L', dataCodewords: 428, ecCodewordsPerBlock: 26, group1Blocks: 4, group1DataCodewords: 107, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '13-M', dataCodewords: 334, ecCodewordsPerBlock: 22, group1Blocks: 8, group1DataCodewords: 37, group2Blocks: 1, group2DataCodewords: 38 },
    { versionEcc: '13-Q', dataCodewords: 244, ecCodewordsPerBlock: 24, group1Blocks: 8, group1DataCodewords: 20, group2Blocks: 4, group2DataCodewords: 21 },
    { versionEcc: '13-H', dataCodewords: 180, ecCodewordsPerBlock: 22, group1Blocks: 12, group1DataCodewords: 11, group2Blocks: 4, group2DataCodewords: 12 },
    { versionEcc: '14-L', dataCodewords: 461, ecCodewordsPerBlock: 30, group1Blocks: 3, group1DataCodewords: 115, group2Blocks: 1, group2DataCodewords: 116 },
    { versionEcc: '14-M', dataCodewords: 365, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 40, group2Blocks: 5, group2DataCodewords: 41 },
    { versionEcc: '14-Q', dataCodewords: 261, ecCodewordsPerBlock: 20, group1Blocks: 11, group1DataCodewords: 16, group2Blocks: 5, group2DataCodewords: 17 },
    { versionEcc: '14-H', dataCodewords: 197, ecCodewordsPerBlock: 24, group1Blocks: 11, group1DataCodewords: 12, group2Blocks: 5, group2DataCodewords: 13 },
    { versionEcc: '15-L', dataCodewords: 523, ecCodewordsPerBlock: 22, group1Blocks: 5, group1DataCodewords: 87, group2Blocks: 1, group2DataCodewords: 88 },
    { versionEcc: '15-M', dataCodewords: 415, ecCodewordsPerBlock: 24, group1Blocks: 5, group1DataCodewords: 41, group2Blocks: 5, group2DataCodewords: 42 },
    { versionEcc: '15-Q', dataCodewords: 295, ecCodewordsPerBlock: 30, group1Blocks: 5, group1DataCodewords: 24, group2Blocks: 7, group2DataCodewords: 25 },
    { versionEcc: '15-H', dataCodewords: 223, ecCodewordsPerBlock: 24, group1Blocks: 11, group1DataCodewords: 12, group2Blocks: 7, group2DataCodewords: 13 },
    { versionEcc: '16-L', dataCodewords: 589, ecCodewordsPerBlock: 24, group1Blocks: 5, group1DataCodewords: 98, group2Blocks: 1, group2DataCodewords: 99 },
    { versionEcc: '16-M', dataCodewords: 453, ecCodewordsPerBlock: 28, group1Blocks: 7, group1DataCodewords: 45, group2Blocks: 3, group2DataCodewords: 46 },
    { versionEcc: '16-Q', dataCodewords: 325, ecCodewordsPerBlock: 24, group1Blocks: 15, group1DataCodewords: 19, group2Blocks: 2, group2DataCodewords: 20 },
    { versionEcc: '16-H', dataCodewords: 253, ecCodewordsPerBlock: 30, group1Blocks: 3, group1DataCodewords: 15, group2Blocks: 13, group2DataCodewords: 16 },
    { versionEcc: '17-L', dataCodewords: 647, ecCodewordsPerBlock: 28, group1Blocks: 1, group1DataCodewords: 107, group2Blocks: 5, group2DataCodewords: 108 },
    { versionEcc: '17-M', dataCodewords: 507, ecCodewordsPerBlock: 28, group1Blocks: 10, group1DataCodewords: 46, group2Blocks: 1, group2DataCodewords: 47 },
    { versionEcc: '17-Q', dataCodewords: 367, ecCodewordsPerBlock: 28, group1Blocks: 1, group1DataCodewords: 22, group2Blocks: 15, group2DataCodewords: 23 },
    { versionEcc: '17-H', dataCodewords: 283, ecCodewordsPerBlock: 28, group1Blocks: 2, group1DataCodewords: 14, group2Blocks: 17, group2DataCodewords: 15 },
    { versionEcc: '18-L', dataCodewords: 721, ecCodewordsPerBlock: 30, group1Blocks: 5, group1DataCodewords: 120, group2Blocks: 1, group2DataCodewords: 121 },
    { versionEcc: '18-M', dataCodewords: 563, ecCodewordsPerBlock: 26, group1Blocks: 9, group1DataCodewords: 43, group2Blocks: 4, group2DataCodewords: 44 },
    { versionEcc: '18-Q', dataCodewords: 397, ecCodewordsPerBlock: 28, group1Blocks: 17, group1DataCodewords: 22, group2Blocks: 1, group2DataCodewords: 23 },
    { versionEcc: '18-H', dataCodewords: 313, ecCodewordsPerBlock: 28, group1Blocks: 2, group1DataCodewords: 14, group2Blocks: 19, group2DataCodewords: 15 },
    { versionEcc: '19-L', dataCodewords: 795, ecCodewordsPerBlock: 28, group1Blocks: 3, group1DataCodewords: 113, group2Blocks: 4, group2DataCodewords: 114 },
    { versionEcc: '19-M', dataCodewords: 627, ecCodewordsPerBlock: 26, group1Blocks: 3, group1DataCodewords: 44, group2Blocks: 11, group2DataCodewords: 45 },
    { versionEcc: '19-Q', dataCodewords: 445, ecCodewordsPerBlock: 26, group1Blocks: 17, group1DataCodewords: 21, group2Blocks: 4, group2DataCodewords: 22 },
    { versionEcc: '19-H', dataCodewords: 341, ecCodewordsPerBlock: 26, group1Blocks: 9, group1DataCodewords: 13, group2Blocks: 16, group2DataCodewords: 14 },
    { versionEcc: '20-L', dataCodewords: 861, ecCodewordsPerBlock: 28, group1Blocks: 3, group1DataCodewords: 107, group2Blocks: 5, group2DataCodewords: 108 },
    { versionEcc: '20-M', dataCodewords: 669, ecCodewordsPerBlock: 26, group1Blocks: 3, group1DataCodewords: 41, group2Blocks: 13, group2DataCodewords: 42 },
    { versionEcc: '20-Q', dataCodewords: 485, ecCodewordsPerBlock: 30, group1Blocks: 15, group1DataCodewords: 24, group2Blocks: 5, group2DataCodewords: 25 },
    { versionEcc: '20-H', dataCodewords: 385, ecCodewordsPerBlock: 28, group1Blocks: 15, group1DataCodewords: 15, group2Blocks: 10, group2DataCodewords: 16 },
    { versionEcc: '21-L', dataCodewords: 932, ecCodewordsPerBlock: 28, group1Blocks: 4, group1DataCodewords: 116, group2Blocks: 4, group2DataCodewords: 117 },
    { versionEcc: '21-M', dataCodewords: 714, ecCodewordsPerBlock: 26, group1Blocks: 17, group1DataCodewords: 42, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '21-Q', dataCodewords: 512, ecCodewordsPerBlock: 28, group1Blocks: 17, group1DataCodewords: 22, group2Blocks: 6, group2DataCodewords: 23 },
    { versionEcc: '21-H', dataCodewords: 406, ecCodewordsPerBlock: 30, group1Blocks: 19, group1DataCodewords: 16, group2Blocks: 6, group2DataCodewords: 17 },
    { versionEcc: '22-L', dataCodewords: 1006, ecCodewordsPerBlock: 28, group1Blocks: 2, group1DataCodewords: 111, group2Blocks: 7, group2DataCodewords: 112 },
    { versionEcc: '22-M', dataCodewords: 782, ecCodewordsPerBlock: 28, group1Blocks: 17, group1DataCodewords: 46, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '22-Q', dataCodewords: 568, ecCodewordsPerBlock: 30, group1Blocks: 7, group1DataCodewords: 24, group2Blocks: 16, group2DataCodewords: 25 },
    { versionEcc: '22-H', dataCodewords: 442, ecCodewordsPerBlock: 24, group1Blocks: 34, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '23-L', dataCodewords: 1094, ecCodewordsPerBlock: 30, group1Blocks: 4, group1DataCodewords: 121, group2Blocks: 5, group2DataCodewords: 122 },
    { versionEcc: '23-M', dataCodewords: 860, ecCodewordsPerBlock: 28, group1Blocks: 4, group1DataCodewords: 47, group2Blocks: 14, group2DataCodewords: 48 },
    { versionEcc: '23-Q', dataCodewords: 614, ecCodewordsPerBlock: 30, group1Blocks: 11, group1DataCodewords: 24, group2Blocks: 14, group2DataCodewords: 25 },
    { versionEcc: '23-H', dataCodewords: 464, ecCodewordsPerBlock: 30, group1Blocks: 16, group1DataCodewords: 15, group2Blocks: 14, group2DataCodewords: 16 },
    { versionEcc: '24-L', dataCodewords: 1174, ecCodewordsPerBlock: 30, group1Blocks: 6, group1DataCodewords: 117, group2Blocks: 4, group2DataCodewords: 118 },
    { versionEcc: '24-M', dataCodewords: 914, ecCodewordsPerBlock: 28, group1Blocks: 6, group1DataCodewords: 45, group2Blocks: 14, group2DataCodewords: 46 },
    { versionEcc: '24-Q', dataCodewords: 664, ecCodewordsPerBlock: 30, group1Blocks: 11, group1DataCodewords: 24, group2Blocks: 16, group2DataCodewords: 25 },
    { versionEcc: '24-H', dataCodewords: 514, ecCodewordsPerBlock: 30, group1Blocks: 30, group1DataCodewords: 16, group2Blocks: 2, group2DataCodewords: 17 },
    { versionEcc: '25-L', dataCodewords: 1276, ecCodewordsPerBlock: 26, group1Blocks: 8, group1DataCodewords: 106, group2Blocks: 4, group2DataCodewords: 107 },
    { versionEcc: '25-M', dataCodewords: 1000, ecCodewordsPerBlock: 28, group1Blocks: 8, group1DataCodewords: 47, group2Blocks: 13, group2DataCodewords: 48 },
    { versionEcc: '25-Q', dataCodewords: 718, ecCodewordsPerBlock: 30, group1Blocks: 7, group1DataCodewords: 24, group2Blocks: 22, group2DataCodewords: 25 },
    { versionEcc: '25-H', dataCodewords: 538, ecCodewordsPerBlock: 30, group1Blocks: 22, group1DataCodewords: 15, group2Blocks: 13, group2DataCodewords: 16 },
    { versionEcc: '26-L', dataCodewords: 1370, ecCodewordsPerBlock: 28, group1Blocks: 10, group1DataCodewords: 114, group2Blocks: 2, group2DataCodewords: 115 },
    { versionEcc: '26-M', dataCodewords: 1062, ecCodewordsPerBlock: 28, group1Blocks: 19, group1DataCodewords: 46, group2Blocks: 4, group2DataCodewords: 47 },
    { versionEcc: '26-Q', dataCodewords: 754, ecCodewordsPerBlock: 28, group1Blocks: 28, group1DataCodewords: 22, group2Blocks: 6, group2DataCodewords: 23 },
    { versionEcc: '26-H', dataCodewords: 596, ecCodewordsPerBlock: 30, group1Blocks: 33, group1DataCodewords: 16, group2Blocks: 4, group2DataCodewords: 17 },
    { versionEcc: '27-L', dataCodewords: 1468, ecCodewordsPerBlock: 30, group1Blocks: 8, group1DataCodewords: 122, group2Blocks: 4, group2DataCodewords: 123 },
    { versionEcc: '27-M', dataCodewords: 1128, ecCodewordsPerBlock: 28, group1Blocks: 22, group1DataCodewords: 45, group2Blocks: 3, group2DataCodewords: 46 },
    { versionEcc: '27-Q', dataCodewords: 808, ecCodewordsPerBlock: 30, group1Blocks: 8, group1DataCodewords: 23, group2Blocks: 26, group2DataCodewords: 24 },
    { versionEcc: '27-H', dataCodewords: 628, ecCodewordsPerBlock: 30, group1Blocks: 12, group1DataCodewords: 15, group2Blocks: 28, group2DataCodewords: 16 },
    { versionEcc: '28-L', dataCodewords: 1531, ecCodewordsPerBlock: 30, group1Blocks: 3, group1DataCodewords: 117, group2Blocks: 10, group2DataCodewords: 118 },
    { versionEcc: '28-M', dataCodewords: 1193, ecCodewordsPerBlock: 28, group1Blocks: 3, group1DataCodewords: 45, group2Blocks: 23, group2DataCodewords: 46 },
    { versionEcc: '28-Q', dataCodewords: 871, ecCodewordsPerBlock: 30, group1Blocks: 4, group1DataCodewords: 24, group2Blocks: 31, group2DataCodewords: 25 },
    { versionEcc: '28-H', dataCodewords: 661, ecCodewordsPerBlock: 30, group1Blocks: 11, group1DataCodewords: 15, group2Blocks: 31, group2DataCodewords: 16 },
    { versionEcc: '29-L', dataCodewords: 1631, ecCodewordsPerBlock: 30, group1Blocks: 7, group1DataCodewords: 116, group2Blocks: 7, group2DataCodewords: 117 },
    { versionEcc: '29-M', dataCodewords: 1267, ecCodewordsPerBlock: 28, group1Blocks: 21, group1DataCodewords: 45, group2Blocks: 7, group2DataCodewords: 46 },
    { versionEcc: '29-Q', dataCodewords: 911, ecCodewordsPerBlock: 30, group1Blocks: 1, group1DataCodewords: 23, group2Blocks: 37, group2DataCodewords: 24 },
    { versionEcc: '29-H', dataCodewords: 701, ecCodewordsPerBlock: 30, group1Blocks: 19, group1DataCodewords: 15, group2Blocks: 26, group2DataCodewords: 16 },
    { versionEcc: '30-L', dataCodewords: 1735, ecCodewordsPerBlock: 30, group1Blocks: 5, group1DataCodewords: 115, group2Blocks: 10, group2DataCodewords: 116 },
    { versionEcc: '30-M', dataCodewords: 1373, ecCodewordsPerBlock: 28, group1Blocks: 19, group1DataCodewords: 47, group2Blocks: 10, group2DataCodewords: 48 },
    { versionEcc: '30-Q', dataCodewords: 985, ecCodewordsPerBlock: 30, group1Blocks: 15, group1DataCodewords: 24, group2Blocks: 25, group2DataCodewords: 25 },
    { versionEcc: '30-H', dataCodewords: 745, ecCodewordsPerBlock: 30, group1Blocks: 23, group1DataCodewords: 15, group2Blocks: 25, group2DataCodewords: 16 },
    { versionEcc: '31-L', dataCodewords: 1843, ecCodewordsPerBlock: 30, group1Blocks: 13, group1DataCodewords: 115, group2Blocks: 3, group2DataCodewords: 116 },
    { versionEcc: '31-M', dataCodewords: 1455, ecCodewordsPerBlock: 28, group1Blocks: 2, group1DataCodewords: 46, group2Blocks: 29, group2DataCodewords: 47 },
    { versionEcc: '31-Q', dataCodewords: 1033, ecCodewordsPerBlock: 30, group1Blocks: 42, group1DataCodewords: 24, group2Blocks: 1, group2DataCodewords: 25 },
    { versionEcc: '31-H', dataCodewords: 793, ecCodewordsPerBlock: 30, group1Blocks: 23, group1DataCodewords: 15, group2Blocks: 28, group2DataCodewords: 16 },
    { versionEcc: '32-L', dataCodewords: 1955, ecCodewordsPerBlock: 30, group1Blocks: 17, group1DataCodewords: 115, group2Blocks: 0, group2DataCodewords: 0 },
    { versionEcc: '32-M', dataCodewords: 1541, ecCodewordsPerBlock: 28, group1Blocks: 10, group1DataCodewords: 46, group2Blocks: 23, group2DataCodewords: 47 },
    { versionEcc: '32-Q', dataCodewords: 1115, ecCodewordsPerBlock: 30, group1Blocks: 10, group1DataCodewords: 24, group2Blocks: 35, group2DataCodewords: 25 },
    { versionEcc: '32-H', dataCodewords: 845, ecCodewordsPerBlock: 30, group1Blocks: 19, group1DataCodewords: 15, group2Blocks: 35, group2DataCodewords: 16 },
    { versionEcc: '33-L', dataCodewords: 2071, ecCodewordsPerBlock: 30, group1Blocks: 17, group1DataCodewords: 115, group2Blocks: 1, group2DataCodewords: 116 },
    { versionEcc: '33-M', dataCodewords: 1631, ecCodewordsPerBlock: 28, group1Blocks: 14, group1DataCodewords: 46, group2Blocks: 21, group2DataCodewords: 47 },
    { versionEcc: '33-Q', dataCodewords: 1171, ecCodewordsPerBlock: 30, group1Blocks: 29, group1DataCodewords: 24, group2Blocks: 19, group2DataCodewords: 25 },
    { versionEcc: '33-H', dataCodewords: 901, ecCodewordsPerBlock: 30, group1Blocks: 11, group1DataCodewords: 15, group2Blocks: 46, group2DataCodewords: 16 },
    { versionEcc: '34-L', dataCodewords: 2191, ecCodewordsPerBlock: 30, group1Blocks: 13, group1DataCodewords: 115, group2Blocks: 6, group2DataCodewords: 116 },
    { versionEcc: '34-M', dataCodewords: 1725, ecCodewordsPerBlock: 28, group1Blocks: 14, group1DataCodewords: 46, group2Blocks: 23, group2DataCodewords: 47 },
    { versionEcc: '34-Q', dataCodewords: 1231, ecCodewordsPerBlock: 30, group1Blocks: 44, group1DataCodewords: 24, group2Blocks: 7, group2DataCodewords: 25 },
    { versionEcc: '34-H', dataCodewords: 961, ecCodewordsPerBlock: 30, group1Blocks: 59, group1DataCodewords: 16, group2Blocks: 1, group2DataCodewords: 17 },
    { versionEcc: '35-L', dataCodewords: 2306, ecCodewordsPerBlock: 30, group1Blocks: 12, group1DataCodewords: 121, group2Blocks: 7, group2DataCodewords: 122 },
    { versionEcc: '35-M', dataCodewords: 1812, ecCodewordsPerBlock: 28, group1Blocks: 12, group1DataCodewords: 47, group2Blocks: 26, group2DataCodewords: 48 },
    { versionEcc: '35-Q', dataCodewords: 1286, ecCodewordsPerBlock: 30, group1Blocks: 39, group1DataCodewords: 24, group2Blocks: 14, group2DataCodewords: 25 },
    { versionEcc: '35-H', dataCodewords: 986, ecCodewordsPerBlock: 30, group1Blocks: 22, group1DataCodewords: 15, group2Blocks: 41, group2DataCodewords: 16 },
    { versionEcc: '36-L', dataCodewords: 2434, ecCodewordsPerBlock: 30, group1Blocks: 6, group1DataCodewords: 121, group2Blocks: 14, group2DataCodewords: 122 },
    { versionEcc: '36-M', dataCodewords: 1914, ecCodewordsPerBlock: 28, group1Blocks: 6, group1DataCodewords: 47, group2Blocks: 34, group2DataCodewords: 48 },
    { versionEcc: '36-Q', dataCodewords: 1354, ecCodewordsPerBlock: 30, group1Blocks: 46, group1DataCodewords: 24, group2Blocks: 10, group2DataCodewords: 25 },
    { versionEcc: '36-H', dataCodewords: 1054, ecCodewordsPerBlock: 30, group1Blocks: 2, group1DataCodewords: 15, group2Blocks: 64, group2DataCodewords: 16 },
    { versionEcc: '37-L', dataCodewords: 2566, ecCodewordsPerBlock: 30, group1Blocks: 17, group1DataCodewords: 122, group2Blocks: 4, group2DataCodewords: 123 },
    { versionEcc: '37-M', dataCodewords: 1992, ecCodewordsPerBlock: 28, group1Blocks: 29, group1DataCodewords: 46, group2Blocks: 14, group2DataCodewords: 47 },
    { versionEcc: '37-Q', dataCodewords: 1426, ecCodewordsPerBlock: 30, group1Blocks: 49, group1DataCodewords: 24, group2Blocks: 10, group2DataCodewords: 25 },
    { versionEcc: '37-H', dataCodewords: 1096, ecCodewordsPerBlock: 30, group1Blocks: 24, group1DataCodewords: 15, group2Blocks: 46, group2DataCodewords: 16 },
    { versionEcc: '38-L', dataCodewords: 2702, ecCodewordsPerBlock: 30, group1Blocks: 4, group1DataCodewords: 122, group2Blocks: 18, group2DataCodewords: 123 },
    { versionEcc: '38-M', dataCodewords: 2102, ecCodewordsPerBlock: 28, group1Blocks: 13, group1DataCodewords: 46, group2Blocks: 32, group2DataCodewords: 47 },
    { versionEcc: '38-Q', dataCodewords: 1502, ecCodewordsPerBlock: 30, group1Blocks: 48, group1DataCodewords: 24, group2Blocks: 14, group2DataCodewords: 25 },
    { versionEcc: '38-H', dataCodewords: 1142, ecCodewordsPerBlock: 30, group1Blocks: 42, group1DataCodewords: 15, group2Blocks: 32, group2DataCodewords: 16 },
    { versionEcc: '39-L', dataCodewords: 2812, ecCodewordsPerBlock: 30, group1Blocks: 20, group1DataCodewords: 117, group2Blocks: 4, group2DataCodewords: 118 },
    { versionEcc: '39-M', dataCodewords: 2216, ecCodewordsPerBlock: 28, group1Blocks: 40, group1DataCodewords: 47, group2Blocks: 7, group2DataCodewords: 48 },
    { versionEcc: '39-Q', dataCodewords: 1582, ecCodewordsPerBlock: 30, group1Blocks: 43, group1DataCodewords: 24, group2Blocks: 22, group2DataCodewords: 25 },
    { versionEcc: '39-H', dataCodewords: 1222, ecCodewordsPerBlock: 30, group1Blocks: 10, group1DataCodewords: 15, group2Blocks: 67, group2DataCodewords: 16 },
    { versionEcc: '40-L', dataCodewords: 2956, ecCodewordsPerBlock: 30, group1Blocks: 19, group1DataCodewords: 118, group2Blocks: 6, group2DataCodewords: 119 },
    { versionEcc: '40-M', dataCodewords: 2334, ecCodewordsPerBlock: 28, group1Blocks: 18, group1DataCodewords: 47, group2Blocks: 31, group2DataCodewords: 48 },
    { versionEcc: '40-Q', dataCodewords: 1666, ecCodewordsPerBlock: 30, group1Blocks: 34, group1DataCodewords: 24, group2Blocks: 34, group2DataCodewords: 25 },
    { versionEcc: '40-H', dataCodewords: 1276, ecCodewordsPerBlock: 30, group1Blocks: 20, group1DataCodewords: 15, group2Blocks: 61, group2DataCodewords: 16 }
  ];

  // Source metadata used to live in a separate JSON sidecar. It is now embedded
  // here so the runtime is the single canonical artifact.
  const SPEC_SOURCES = [
    {
      title: 'ISO/IEC 18004',
      note: 'Normative QR Code symbology specification.'
    },
    {
      title: 'DENSO WAVE QR Code.com',
      url: 'https://www.qrcode.com/en/'
    },
    {
      title: 'Thonky QR Code Tutorial',
      url: 'https://www.thonky.com/qr-code-tutorial/'
    }
  ];

  // Offsets into versionData rows for the four ECC levels.
  const ECC_DATA_INDEX = { L: 2, M: 3, Q: 4, H: 5 };

  // Alternating pad bytes used to fill remaining payload capacity.
  const PAD_CODEWORDS = [0xEC, 0x11];

  // Structured payload presets used by the live encoder and the public API.
  const ENCODER_TYPE_OPTIONS = [
    { key: 'text', label: 'Text', envelope: 'No prefix' },
    { key: 'uri', label: 'Generic URI', envelope: 'URI string' },
    { key: 'url', label: 'URL', envelope: 'URI string' },
    { key: 'email', label: 'Email', envelope: 'mailto:' },
    { key: 'phone', label: 'Phone', envelope: 'tel:' },
    { key: 'sms', label: 'SMS', envelope: 'SMSTO:' },
    { key: 'contact', label: 'Contact', envelope: 'MECARD:' },
    { key: 'vcard', label: 'vCard', envelope: 'BEGIN:VCARD' },
    { key: 'event', label: 'Event', envelope: 'BEGIN:VCALENDAR' },
    { key: 'wifi', label: 'Wi-Fi', envelope: 'WIFI:' },
    { key: 'geo', label: 'Geo', envelope: 'geo:' }
  ];
  // Example defaults make the file self-demonstrating and keep the UI usable
  // even when no external state is present.
  const DEFAULT_INPUTS = {
    text: { value: 'HELLO WORLD' },
    uri: { value: 'sip:ada@example.com' },
    url: { value: 'https://example.com' },
    email: { address: 'ada@example.com', subject: 'Hello', body: 'Thanks for scanning this QR.' },
    phone: { number: '+15551234567' },
    sms: { number: '+15551234567', message: 'Hello from QR Peach' },
    contact: {
      name: 'Ada Lovelace',
      org: 'Analytical Engines',
      phone: '+15551234567',
      email: 'ada@example.com',
      url: 'https://example.com',
      note: 'First programmer'
    },
    vcard: {
      name: 'Ada Lovelace',
      org: 'Analytical Engines',
      phone: '+15551234567',
      email: 'ada@example.com',
      url: 'https://example.com',
      note: 'First programmer'
    },
    event: {
      title: 'QR Peach Demo',
      start: '2026-06-01T09:00',
      end: '2026-06-01T10:00',
      location: 'Main Studio',
      description: 'Walk through the QR payload and symbol structure.',
      allDay: false,
      timezone: ''
    },
    wifi: { ssid: 'Cafe WiFi', encryption: 'WPA', password: 'secret123', hidden: false },
    geo: { lat: '37.7749', lng: '-122.4194', query: 'Coffee shop' }
  };
  // Mode indicators are included for completeness even though the live encoder
  // currently serializes all payloads in byte mode.
  const MODE_BITS = { numeric: '0001', alphanumeric: '0010', byte: '0100', kanji: '1000' };

  // The format field stores ECC level and chosen mask pattern.
  const FORMAT_INFO_ECC_BITS = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };
  const FORMAT_GENERATOR = 0b10100110111;
  const FORMAT_MASK = 0b101010000010010;
  const VERSION_GENERATOR = 0x1F25;

  // GF(256) arithmetic tables for Reed-Solomon ECC generation.
  const GF_PRIMITIVE = 0x11D;
  const gfExp = new Array(512);
  const gfLog = new Array(256);
  const rsGeneratorCache = {};

  // Fast lookup keyed by "version-ecc", derived from rsBlockRows.
  const rsBlockMap = Object.create(null);
  const utf8Encoder = new TextEncoder();

  // Normalize the flat RS row data into grouped block descriptions that are
  // easier to consume while building ECC blocks.
  rsBlockRows.forEach(function (row) {
    rsBlockMap[row.versionEcc] = {
      dataCodewords: row.dataCodewords,
      ecCodewordsPerBlock: row.ecCodewordsPerBlock,
      groups: [
        row.group1Blocks ? { blocks: row.group1Blocks, dataCodewords: row.group1DataCodewords } : null,
        row.group2Blocks ? { blocks: row.group2Blocks, dataCodewords: row.group2DataCodewords } : null
      ].filter(Boolean)
    };
  });

  // Precompute exponent/log tables once so polynomial arithmetic can stay fast
  // and readable in the hot ECC path.
  (function initGaloisField() {
    let value = 1;
    for (let i = 0; i < 255; i++) {
      gfExp[i] = value;
      gfLog[value] = i;
      value <<= 1;
      if (value & 0x100) value ^= GF_PRIMITIVE;
    }
    for (let i = 255; i < 512; i++) {
      gfExp[i] = gfExp[i - 255];
    }
  })();

  // JSON-compatible data is returned throughout the public API, so a JSON clone
  // keeps the behavior obvious and deterministic.
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  // Copy a boolean matrix row by row so mask trials and placement stages can
  // mutate their own working copy without affecting the source matrix.
  function cloneMatrix(matrix) {
    return matrix.map(function (row) { return row.slice(); });
  }

  // Build a square matrix pre-filled with one value for structural grids,
  // reservation maps, sampled debug matrices, and blank render surfaces.
  function createMatrix(size, fillValue) {
    return Array.from({ length: size }, function () {
      return Array.from({ length: size }, function () {
        return fillValue;
      });
    });
  }

  // Resolve one payload type definition and fall back to the plain-text option
  // when callers pass an unknown type key.
  function getEncoderTypeOption(type) {
    return ENCODER_TYPE_OPTIONS.find(function (option) {
      return option.key === type;
    }) || ENCODER_TYPE_OPTIONS[0];
  }

  // Read one version row from the embedded capacity table and fail fast when a
  // caller asks for a version outside the QR specification range.
  function getVersionRecord(version) {
    const row = versionData[version - 1];
    if (!row) {
      throw new Error('Version must be between 1 and 40.');
    }
    return row;
  }

  // Byte mode uses an 8-bit count field in versions 1-9 and a 16-bit count
  // field in versions 10-40.
  function getByteModeCountBits(version) {
    return version <= 9 ? 8 : 16;
  }

  function escapeVCardText(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,');
  }

  function escapeICalendarText(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,');
  }

  function formatICalendarDateTime(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (/^\d{8}$/.test(text)) return text;
    if (/^\d{8}T\d{6}Z?$/i.test(text)) return text.toUpperCase();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(Z)?$/i);
    if (match) {
      const date = match[1] + match[2] + match[3];
      if (!match[4]) return date;
      return date + 'T' + match[4] + match[5] + (match[6] || '00') + (match[7] ? 'Z' : '');
    }
    return text.replace(/[^0-9TZ]/gi, '').toUpperCase();
  }

  function formatICalendarDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (/^\d{8}$/.test(text)) return text;
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return match[1] + match[2] + match[3];
    }
    const dateTime = formatICalendarDateTime(text);
    return /^\d{8}/.test(dateTime) ? dateTime.slice(0, 8) : '';
  }

  function addOneDayToICalendarDate(value) {
    if (!/^\d{8}$/.test(value)) return value;
    const date = new Date(Date.UTC(
      parseInt(value.slice(0, 4), 10),
      parseInt(value.slice(4, 6), 10) - 1,
      parseInt(value.slice(6, 8), 10)
    ));
    date.setUTCDate(date.getUTCDate() + 1);
    return String(date.getUTCFullYear())
      + String(date.getUTCMonth() + 1).padStart(2, '0')
      + String(date.getUTCDate()).padStart(2, '0');
  }

  function escapeICalendarParam(value) {
    return String(value || '').replace(/([,;])/g, '\\$1');
  }

  // Look up the number of payload data codewords available for one version and
  // ECC level.
  function getDataCodewordCount(version, eccLevel) {
    return getVersionRecord(version)[ECC_DATA_INDEX[eccLevel]];
  }

  // Fetch the grouped Reed-Solomon block layout for one version/ECC pair and
  // return a clone so downstream code can annotate it safely.
  function getRsBlockInfo(version, eccLevel) {
    const key = version + '-' + eccLevel;
    const row = rsBlockMap[key];
    if (!row) {
      throw new Error('Missing RS block data for version ' + version + ' level ' + eccLevel + '.');
    }
    return deepClone(row);
  }

  // Expand a version's alignment center list into actual center coordinates,
  // skipping any position that would collide with a finder corner.
  function getAlignmentCenters(version) {
    const size = 17 + 4 * version;
    const centers = alignCenters[version] || [];
    const positions = [];
    for (let ri = 0; ri < centers.length; ri++) {
      for (let ci = 0; ci < centers.length; ci++) {
        const cr = centers[ri];
        const cc = centers[ci];
        const overlapTL = cr - 2 <= 8 && cc - 2 <= 8;
        const overlapTR = cr - 2 <= 8 && cc + 2 >= size - 8;
        const overlapBL = cr + 2 >= size - 8 && cc - 2 <= 8;
        if (!overlapTL && !overlapTR && !overlapBL) {
          positions.push([cr, cc]);
        }
      }
    }
    return positions;
  }

  // Alignment patterns are omitted when they would overlap the three finder
  // pattern regions. This count feeds the exposed metadata and page copy.
  function getAlignmentPatternCount(version) {
    return getAlignmentCenters(version).length;
  }

  // Convenience wrapper used by the site to show per-version facts without
  // duplicating table math in page scripts.
  function getVersionInfo(version, eccLevel) {
    const row = getVersionRecord(version);
    const size = 17 + 4 * version;
    const dataCW = getDataCodewordCount(version, eccLevel);
    const totalCW = row[1];
    const rsInfo = getRsBlockInfo(version, eccLevel);
    return {
      version: version,
      size: size,
      totalModules: size * size,
      alignmentPatternCount: getAlignmentPatternCount(version),
      hasVersionInfo: version >= 7,
      totalCodewords: totalCW,
      dataCodewords: dataCW,
      eccCodewords: totalCW - dataCW,
      remainderBits: remainderBits[version - 1],
      capacities: {
        numeric: row[6],
        alphanumeric: row[7],
        binary: row[8],
        kanji: row[9]
      },
      eccProfile: {
        L: row[2],
        M: row[3],
        Q: row[4],
        H: row[5]
      },
      rsBlocks: rsInfo
    };
  }

  // Payload construction ---------------------------------------------------

  // Convert whitespace and control characters into short display labels that
  // stay readable in tables, tooltips, and debug summaries.
  function formatDisplayChar(char) {
    if (char === ' ') return 'SPACE';
    if (char === '\n') return '\\n';
    if (char === '\r') return '\\r';
    if (char === '\t') return '\\t';
    return char;
  }

  // Format a byte value as two uppercase hexadecimal digits for codeword and
  // payload inspection output.
  function formatHexByte(value) {
    return value.toString(16).toUpperCase().padStart(2, '0');
  }

  // Structured payload formats require escaping their own field delimiters
  // before the whole payload is encoded as UTF-8 bytes.
  function escapeStructuredField(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/:/g, '\\:')
      .replace(/\n/g, '\\n');
  }

  // Start from known defaults so partially provided input objects remain valid
  // and predictable across page loads and API use.
  function mergeInputs(type, partialInputs) {
    const defaults = deepClone(DEFAULT_INPUTS[type] || DEFAULT_INPUTS.text);
    return Object.assign(defaults, partialInputs || {});
  }

  // Convert the higher-level payload type selection into the literal string a
  // QR scanner expects to decode.
  function buildPayloadInfo(type, rawInputs) {
    const resolvedType = getEncoderTypeOption(type).key;
    const option = getEncoderTypeOption(resolvedType);
    const inputs = mergeInputs(resolvedType, rawInputs);

    switch (resolvedType) {
      case 'uri': {
        const payload = String(inputs.value || '');
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Encodes a generic URI string so scheme-based payloads such as sip:, otpauth:, or custom deep links can be carried directly in the QR.',
          scannerRule: 'Readers inspect the leading URI scheme inside the payload and hand it to an app that recognizes that scheme.',
          inputs: inputs,
          payload: payload
        };
      }
      case 'url': {
        const payload = String(inputs.value || '');
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Encodes a web URL. A scanner decides it is a link because the payload itself uses standard web URI syntax such as https://.',
          scannerRule: 'Leading web URI syntax such as https:// is part of the payload byte stream.',
          inputs: inputs,
          payload: payload
        };
      }
      case 'email': {
        const address = String(inputs.address || '').trim();
        const params = [];
        if (inputs.subject) params.push('subject=' + encodeURIComponent(inputs.subject));
        if (inputs.body) params.push('body=' + encodeURIComponent(inputs.body));
        const query = params.length ? '?' + params.join('&') : '';
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Builds a mailto URI. Subject and body are percent-encoded into the query string before the QR is generated.',
          scannerRule: 'Readers recognize the mailto: prefix and open an email compose action.',
          inputs: inputs,
          payload: 'mailto:' + address + query
        };
      }
      case 'phone':
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Wraps the number in a tel URI and encodes that URI as the QR payload.',
          scannerRule: 'Readers look for the tel: prefix and offer to dial.',
          inputs: inputs,
          payload: 'tel:' + String(inputs.number || '').trim()
        };
      case 'sms':
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Uses the common SMSTO envelope where the number and message are separated by colons.',
          scannerRule: 'Readers treat SMSTO:number:message as a pre-filled SMS action.',
          inputs: inputs,
          payload: 'SMSTO:' + String(inputs.number || '').trim() + ':' + String(inputs.message || '')
        };
      case 'contact': {
        const segments = [];
        if (inputs.name) segments.push('N:' + escapeStructuredField(inputs.name));
        if (inputs.org) segments.push('ORG:' + escapeStructuredField(inputs.org));
        if (inputs.phone) segments.push('TEL:' + escapeStructuredField(inputs.phone));
        if (inputs.email) segments.push('EMAIL:' + escapeStructuredField(inputs.email));
        if (inputs.url) segments.push('URL:' + escapeStructuredField(inputs.url));
        if (inputs.note) segments.push('NOTE:' + escapeStructuredField(inputs.note));
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Serializes the fields into a compact MECARD record so scanners can import them as a contact.',
          scannerRule: 'Readers recognize MECARD: and then parse semicolon-delimited fields such as N, TEL, and EMAIL.',
          inputs: inputs,
          payload: 'MECARD:' + segments.join(';') + ';;'
        };
      }
      case 'vcard': {
        const lines = [
          'BEGIN:VCARD',
          'VERSION:3.0'
        ];
        if (inputs.name) lines.push('FN:' + escapeVCardText(inputs.name));
        if (inputs.name) lines.push('N:' + escapeVCardText(inputs.name) + ';;;;');
        if (inputs.org) lines.push('ORG:' + escapeVCardText(inputs.org));
        if (inputs.phone) lines.push('TEL:' + escapeVCardText(inputs.phone));
        if (inputs.email) lines.push('EMAIL:' + escapeVCardText(inputs.email));
        if (inputs.url) lines.push('URL:' + escapeVCardText(inputs.url));
        if (inputs.note) lines.push('NOTE:' + escapeVCardText(inputs.note));
        lines.push('END:VCARD');
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Serializes the fields into a vCard 3.0 record so scanners that support contact import can parse a standards-oriented contact payload.',
          scannerRule: 'Readers recognize the BEGIN:VCARD ... END:VCARD envelope and parse the line-based contact fields.',
          inputs: inputs,
          payload: lines.join('\n')
        };
      }
      case 'event': {
        const lines = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//QR Peach//EN',
          'BEGIN:VEVENT'
        ];
        const allDay = Boolean(inputs.allDay);
        const timezone = String(inputs.timezone || '').trim();
        const start = allDay ? formatICalendarDate(inputs.start) : formatICalendarDateTime(inputs.start);
        const end = allDay ? formatICalendarDate(inputs.end) : formatICalendarDateTime(inputs.end);
        if (inputs.title) lines.push('SUMMARY:' + escapeICalendarText(inputs.title));
        if (start) {
          if (allDay) {
            lines.push('DTSTART;VALUE=DATE:' + start);
          } else if (timezone && !/Z$/i.test(start)) {
            lines.push('DTSTART;TZID=' + escapeICalendarParam(timezone) + ':' + start);
          } else {
            lines.push('DTSTART:' + start);
          }
        }
        if (allDay) {
          const exclusiveEnd = addOneDayToICalendarDate(end || start);
          if (exclusiveEnd) lines.push('DTEND;VALUE=DATE:' + exclusiveEnd);
        } else if (end) {
          if (timezone && !/Z$/i.test(end)) {
            lines.push('DTEND;TZID=' + escapeICalendarParam(timezone) + ':' + end);
          } else {
            lines.push('DTEND:' + end);
          }
        }
        if (inputs.location) lines.push('LOCATION:' + escapeICalendarText(inputs.location));
        if (inputs.description) lines.push('DESCRIPTION:' + escapeICalendarText(inputs.description));
        lines.push('END:VEVENT');
        lines.push('END:VCALENDAR');
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Serializes the fields into an iCalendar VCALENDAR/VEVENT record with timed, all-day, and timezone-aware event support so calendar apps can import the event details.',
          scannerRule: 'Readers recognize the BEGIN:VCALENDAR ... END:VCALENDAR envelope and parse VEVENT fields such as SUMMARY, DTSTART, DTEND, VALUE=DATE, and TZID.',
          inputs: inputs,
          payload: lines.join('\n')
        };
      }
      case 'wifi': {
        const encryption = String(inputs.encryption || 'WPA');
        const passwordSegment = encryption === 'nopass' ? '' : 'P:' + escapeStructuredField(inputs.password) + ';';
        const hiddenSegment = inputs.hidden ? 'H:true;' : '';
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Builds a WIFI record with network type, SSID, password, and optional hidden flag.',
          scannerRule: 'Readers look for WIFI: and parse semicolon-delimited network fields inside the payload.',
          inputs: inputs,
          payload: 'WIFI:T:' + encryption + ';S:' + escapeStructuredField(inputs.ssid) + ';' + passwordSegment + hiddenSegment + ';'
        };
      }
      case 'geo': {
        const coords = String(inputs.lat || '').trim() + ',' + String(inputs.lng || '').trim();
        const query = inputs.query ? '?q=' + encodeURIComponent(inputs.query) : '';
        return {
          type: resolvedType,
          typeLabel: option.label,
          envelope: option.envelope,
          description: 'Encodes a geo URI with latitude, longitude, and an optional query string.',
          scannerRule: 'Readers look for the geo: prefix and open a map application.',
          inputs: inputs,
          payload: 'geo:' + coords + query
        };
      }
      case 'text':
      default:
        return {
          type: 'text',
          typeLabel: 'Text',
          envelope: 'No prefix',
          description: 'Plain text is encoded exactly as typed. There is no reserved scanner prefix; the payload bytes are just text.',
          scannerRule: 'Readers simply display or copy the decoded text.',
          inputs: inputs,
          payload: String(inputs.value || '')
        };
    }
  }

  // Expand the final payload string into a UTF-8 byte stream while preserving
  // the character-to-byte mapping that powers the explainer UI.
  function buildUtf8Payload(text) {
    const chars = [];
    const payloadBytes = [];
    let charIndex = 0;
    for (const char of text) {
      const bytes = Array.from(utf8Encoder.encode(char));
      const byteStart = payloadBytes.length;
      for (let i = 0; i < bytes.length; i++) {
        payloadBytes.push({
          value: bytes[i],
          char: char,
          charLabel: formatDisplayChar(char),
          charIndex: charIndex,
          byteOffset: i,
          byteCount: bytes.length
        });
      }
      chars.push({
        char: char,
        charLabel: formatDisplayChar(char),
        bytes: bytes,
        byteStart: byteStart,
        byteEnd: payloadBytes.length - 1
      });
      charIndex++;
    }
    return { chars: chars, payloadBytes: payloadBytes };
  }

  // Annotated bit entries let the UI trace each output bit back to its source.
  function pushAnnotatedBits(target, bitString, buildMeta) {
    for (let i = 0; i < bitString.length; i++) {
      target.push(Object.assign({ bit: bitString[i] }, buildMeta(i, bitString.length - 1 - i)));
    }
  }

  // Group consecutive annotated bit entries into larger value spans so the UI
  // can label one field or character range instead of every individual bit.
  function buildValueSegments(bits) {
    const segments = [];
    let current = null;

    // Finish the current span by calculating its derived display metadata and
    // appending it to the final segment list.
    function flushCurrent() {
      if (!current) return;
      current.index = segments.length;
      current.bitLength = current.bitEnd - current.bitStart + 1;
      current.moduleStartIndex = current.bitStart;
      current.moduleEndIndex = current.bitEnd;
      delete current.lastByteIndex;
      segments.push(current);
    }

    bits.forEach(function (entry, index) {
      const key = entry.kind === 'payload'
        ? 'payload:' + entry.charIndex
        : entry.kind === 'padcw'
          ? 'padcw:' + Math.floor(index / 8)
          : entry.kind;

      if (!current || current.key !== key) {
        flushCurrent();
        current = {
          key: key,
          kind: entry.kind,
          label: entry.kind === 'mode'
            ? 'Mode'
            : entry.kind === 'count'
              ? 'Count'
              : entry.kind === 'payload'
                ? '#' + entry.charIndex + ' ' + entry.charLabel
                : entry.kind === 'terminator'
                  ? 'Terminator'
                  : entry.kind === 'padbits'
                    ? 'Byte Align'
                    : entry.kind === 'padcw'
                      ? 'Pad 0x' + formatHexByte(entry.byteValue)
                      : entry.kind,
          bitStart: index,
          bitEnd: index,
          bits: entry.bit,
          summary: entry.summary,
          detail: entry.detail,
          charIndex: entry.charIndex == null ? null : entry.charIndex,
          charLabel: entry.charLabel || '',
          byteValues: [],
          lastByteIndex: null
        };
      } else {
        current.bitEnd = index;
        current.bits += entry.bit;
      }

      if (entry.byteValue != null && entry.byteIndex !== current.lastByteIndex) {
        current.byteValues.push(entry.byteValue);
        current.lastByteIndex = entry.byteIndex;
      }
    });

    flushCurrent();
    return segments;
  }

  // Byte mode count field width depends on the version band.
  function getByteModeBitRequirement(byteLength, version) {
    return 4 + getByteModeCountBits(version) + byteLength * 8;
  }

  // Used for overflow messaging when the selected version cannot fit a payload.
  function findSuggestedVersion(byteLength, eccLevel) {
    for (let version = 1; version <= 40; version++) {
      const capacityBits = getDataCodewordCount(version, eccLevel) * 8;
      if (getByteModeBitRequirement(byteLength, version) <= capacityBits) {
        return version;
      }
    }
    return null;
  }

  // Pack the payload into byte-mode QR data codewords, including mode bits,
  // byte count, terminator, byte-alignment zeros, and alternating pad bytes.
  function encodePayloadToCodewords(payloadInfo, version, eccLevel) {
    const text = payloadInfo.payload;
    const totalCW = getVersionRecord(version)[1];
    const dataCW = getDataCodewordCount(version, eccLevel);
    const eccCW = totalCW - dataCW;
    const countBits = getByteModeCountBits(version);
    const capacityBits = dataCW * 8;
    const payload = buildUtf8Payload(text);
    const chars = payload.chars;
    const payloadBytes = payload.payloadBytes;

    if (payloadBytes.length >= (1 << countBits)) {
      return {
        ok: false,
        payloadInfo: payloadInfo,
        payloadText: text,
        totalBytes: totalCW,
        dataBytes: dataCW,
        eccBytes: eccCW,
        payloadBytes: payloadBytes,
        chars: chars,
        countBits: countBits,
        capacityBits: capacityBits,
        error: 'Byte count ' + payloadBytes.length + ' exceeds the ' + countBits + '-bit byte-mode count field for version ' + version + '.'
      };
    }

    const bits = [];

    // Mode indicator is always byte mode for this explainer runtime.
    pushAnnotatedBits(bits, MODE_BITS.byte, function () {
      return {
        kind: 'mode',
        summary: 'Mode indicator (byte mode)',
        detail: 'Mode indicator 0100',
        bitNumber: null
      };
    });

    // Count field stores the UTF-8 byte count, not the number of JS code points.
    pushAnnotatedBits(bits, payloadBytes.length.toString(2).padStart(countBits, '0'), function (index, bitNumber) {
      return {
        kind: 'count',
        summary: 'Character count (' + payloadBytes.length + ' bytes)',
        detail: 'Count field bit ' + bitNumber,
        bitNumber: bitNumber
      };
    });

    // Append every payload byte with enough metadata for character/codeword
    // overlays later in the page.
    for (let byteIndex = 0; byteIndex < payloadBytes.length; byteIndex++) {
      const payloadByte = payloadBytes[byteIndex];
      pushAnnotatedBits(bits, payloadByte.value.toString(2).padStart(8, '0'), function (index, bitNumber) {
        return {
          kind: 'payload',
          summary: 'Payload byte ' + byteIndex + ' = 0x' + formatHexByte(payloadByte.value),
          detail: 'UTF-8 byte ' + (payloadByte.byteOffset + 1) + '/' + payloadByte.byteCount + ' for "' + payloadByte.charLabel + '"',
          bitNumber: bitNumber,
          charIndex: payloadByte.charIndex,
          charLabel: payloadByte.charLabel,
          byteIndex: byteIndex,
          byteValue: payloadByte.value
        };
      });
    }

    const payloadBitLength = bits.length;
    if (payloadBitLength > capacityBits) {
      return {
        ok: false,
        payloadInfo: payloadInfo,
        payloadText: text,
        totalBytes: totalCW,
        dataBytes: dataCW,
        eccBytes: eccCW,
        payloadBytes: payloadBytes,
        chars: chars,
        countBits: countBits,
        capacityBits: capacityBits,
        requiredBits: payloadBitLength,
        suggestion: findSuggestedVersion(payloadBytes.length, eccLevel),
        error: 'Need ' + payloadBitLength + ' bits before terminator/padding, but version ' + version + ' level ' + eccLevel + ' only has ' + capacityBits + ' data bits.'
      };
    }

    // QR bitstreams may end with up to four zero terminator bits.
    const terminatorBits = Math.min(4, capacityBits - bits.length);
    pushAnnotatedBits(bits, '0'.repeat(terminatorBits), function (index, bitNumber) {
      return {
        kind: 'terminator',
        summary: 'Terminator',
        detail: 'Terminator bit ' + bitNumber,
        bitNumber: bitNumber
      };
    });

    // After the terminator, byte mode must align to a full codeword boundary.
    const alignBits = (8 - (bits.length % 8)) % 8;
    pushAnnotatedBits(bits, '0'.repeat(alignBits), function () {
      return {
        kind: 'padbits',
        summary: 'Byte alignment',
        detail: 'Zero pad to byte boundary',
        bitNumber: null
      };
    });

    // Remaining capacity is filled by alternating 0xEC / 0x11 pad bytes.
    const dataBitsBeforePadBytes = bits.length;
    let padByteIndex = 0;
    while (bits.length < capacityBits) {
      const padValue = PAD_CODEWORDS[padByteIndex % PAD_CODEWORDS.length];
      pushAnnotatedBits(bits, padValue.toString(2).padStart(8, '0'), function () {
        return {
          kind: 'padcw',
          summary: 'Pad byte 0x' + formatHexByte(padValue),
          detail: 'Alternating pad byte ' + padByteIndex,
          bitNumber: null,
          padValue: padValue,
          byteValue: padValue
        };
      });
      padByteIndex++;
    }

    // Convert annotated bits into byte values for ECC and final placement.
    const dataByteValues = [];
    for (let index = 0; index < dataCW; index++) {
      const byteBits = bits.slice(index * 8, index * 8 + 8);
      const bitString = byteBits.map(function (entry) { return entry.bit; }).join('');
      dataByteValues.push(parseInt(bitString, 2));
    }

    const values = buildValueSegments(bits);

    const charMap = chars.map(function (entry, index) {
      const bitStart = 4 + countBits + entry.byteStart * 8;
      const bitEnd = 4 + countBits + (entry.byteEnd + 1) * 8 - 1;
      return {
        index: index,
        char: entry.char,
        charLabel: entry.charLabel,
        bytes: entry.bytes,
        bitStart: bitStart,
        bitEnd: bitEnd,
        moduleStartIndex: bitStart,
        moduleEndIndex: bitEnd
      };
    });

    return {
      ok: true,
      payloadInfo: payloadInfo,
      payloadText: text,
      totalBytes: totalCW,
      dataBytes: dataCW,
      eccBytes: eccCW,
      countBits: countBits,
      capacityBits: capacityBits,
      payloadBytes: payloadBytes,
      chars: chars,
      bits: bits,
      values: values,
      dataByteValues: dataByteValues,
      charMap: charMap,
      terminatorBits: terminatorBits,
      alignBits: alignBits,
      padByteStart: dataBitsBeforePadBytes / 8,
      padByteCount: dataCW - dataBitsBeforePadBytes / 8,
      payloadBitLength: payloadBitLength,
      remainder: remainderBits[version - 1]
    };
  }

  // Structural maps --------------------------------------------------------

  // Build a labeled structural grid for the explainer overlay. This is not the
  // final QR matrix; it is a semantic map used to describe reserved regions.
  function getModuleGrid(version) {
    const size = 17 + 4 * version;
    const grid = Array.from({ length: size }, function () {
      return new Int8Array(size);
    });

    // Finder patterns use a semantic color code in the overlay grid rather than
    // raw booleans so the UI can distinguish structure types.
    function placeFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[r0 + r][c0 + c] = isOuter || isInner ? 1 : 2;
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    // Write one white separator module when the target cell is still unused.
    function setSeparator(r, c) {
      if (r >= 0 && r < size && c >= 0 && c < size && grid[r][c] === 0) {
        grid[r][c] = 3;
      }
    }

    for (let i = 0; i < 8; i++) {
      setSeparator(7, i);
      setSeparator(i, 7);
      setSeparator(7, size - 8 + i);
      setSeparator(i, size - 8);
      setSeparator(size - 8, i);
      setSeparator(size - 8 + i, 7);
    }

    // Timing patterns run through the main body after finder/separator setup.
    for (let i = 8; i < size - 8; i++) {
      if (grid[6][i] === 0) grid[6][i] = 4;
      if (grid[i][6] === 0) grid[i][6] = 4;
    }

    // Alignment patterns are placed wherever they do not collide with finder
    // pattern territory.
    const aligns = getAlignmentCenters(version);
    aligns.forEach(function (center) {
      const cr = center[0];
      const cc = center[1];
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          grid[cr + dr][cc + dc] = 5;
        }
      }
    });

    // Write one white separator module around a finder region in the semantic
    // overlay grid when that cell has not been claimed yet.
    for (let c = 0; c <= 8; c++) { if (grid[8][c] <= 3) grid[8][c] = 6; }
    for (let r = 0; r <= 8; r++) { if (grid[r][8] <= 3) grid[r][8] = 6; }
    for (let c = size - 8; c < size; c++) { grid[8][c] = 6; }
    for (let r = size - 7; r < size; r++) { grid[r][8] = 6; }
    grid[size - 8][8] = 6;

    // Format information hugs the timing/finder cross sections. Version info is
    // reserved only for versions 7 and above.
    if (version >= 7) {
      for (let r = 0; r < 6; r++) {
        for (let c = size - 11; c <= size - 9; c++) {
          if (grid[r][c] === 0 || grid[r][c] === 4) grid[r][c] = 7;
        }
      }
      for (let r = size - 11; r <= size - 9; r++) {
        for (let c = 0; c < 6; c++) {
          if (grid[r][c] === 0 || grid[r][c] === 4) grid[r][c] = 7;
        }
      }
    }

    return {
      size: size,
      aligns: aligns,
      grid: grid.map(function (row) { return Array.from(row); })
    };
  }

  // Walk the free modules in the exact two-column zig-zag order used by QR
  // payload placement.
  function getFullZigzagPath(grid, size) {
    const points = [];
    let x = size - 1;
    let upward = true;
    while (x >= 0) {
      if (x === 6) x--;
      const x2 = x;
      const x1 = x - 1;
      if (x1 < 0) break;
      if (upward) {
        for (let y = size - 1; y >= 0; y--) {
          if (grid[y][x2] === 0) points.push([y, x2]);
          if (grid[y][x1] === 0) points.push([y, x1]);
        }
      } else {
        for (let y = 0; y < size; y++) {
          if (grid[y][x2] === 0) points.push([y, x2]);
          if (grid[y][x1] === 0) points.push([y, x1]);
        }
      }
      upward = !upward;
      x -= 2;
    }
    return points;
  }

  // Reed-Solomon arithmetic -----------------------------------------------

  // Multiply two GF(256) field elements using the precomputed log/exp tables
  // required by QR Reed-Solomon math.
  function gfMultiply(left, right) {
    if (left === 0 || right === 0) return 0;
    return gfExp[gfLog[left] + gfLog[right]];
  }

  // Multiply two polynomials whose coefficients live in GF(256).
  function multiplyPolynomials(left, right) {
    const result = new Array(left.length + right.length - 1).fill(0);
    for (let i = 0; i < left.length; i++) {
      for (let j = 0; j < right.length; j++) {
        result[i + j] ^= gfMultiply(left[i], right[j]);
      }
    }
    return result;
  }

  // Generator polynomials are cached by degree because many version/ECC combos
  // reuse the same ECC length.
  function getRsGeneratorPolynomial(degree) {
    if (!rsGeneratorCache[degree]) {
      let poly = [1];
      for (let i = 0; i < degree; i++) {
        poly = multiplyPolynomials(poly, [1, gfExp[i]]);
      }
      rsGeneratorCache[degree] = poly;
    }
    return rsGeneratorCache[degree];
  }

  // Classic polynomial long division over GF(256).
  function buildErrorCorrectionCodewords(dataCodewords, ecCodewordsPerBlock) {
    const generator = getRsGeneratorPolynomial(ecCodewordsPerBlock);
    const message = dataCodewords.slice();
    for (let i = 0; i < ecCodewordsPerBlock; i++) {
      message.push(0);
    }
    for (let i = 0; i < dataCodewords.length; i++) {
      const factor = message[i];
      if (factor === 0) continue;
      for (let j = 0; j < generator.length; j++) {
        message[i + j] ^= gfMultiply(generator[j], factor);
      }
    }
    return message.slice(message.length - ecCodewordsPerBlock);
  }

  // Split the payload codewords into the exact grouped block layout for the
  // selected version/ECC combination.
  function buildRsBlocks(dataCodewords, version, eccLevel) {
    const blockInfo = getRsBlockInfo(version, eccLevel);
    const blocks = [];
    let offset = 0;
    blockInfo.groups.forEach(function (group, groupIndex) {
      for (let blockIndex = 0; blockIndex < group.blocks; blockIndex++) {
        const data = dataCodewords.slice(offset, offset + group.dataCodewords);
        offset += group.dataCodewords;
        const ecc = buildErrorCorrectionCodewords(data, blockInfo.ecCodewordsPerBlock);
        blocks.push({
          group: groupIndex + 1,
          index: blocks.length,
          data: data,
          ecc: ecc
        });
      }
    });
    return blocks;
  }

  // Interleave data codewords first, then ECC codewords, per the QR spec.
  function interleaveBlocks(blocks, ecCodewordsPerBlock) {
    const maxDataLength = Math.max.apply(null, blocks.map(function (block) { return block.data.length; }));
    const interleavedData = [];
    const interleavedEcc = [];

    for (let i = 0; i < maxDataLength; i++) {
      blocks.forEach(function (block) {
        if (i < block.data.length) {
          interleavedData.push({
            kind: 'data',
            block: block.index,
            indexInBlock: i,
            value: block.data[i]
          });
        }
      });
    }

    for (let i = 0; i < ecCodewordsPerBlock; i++) {
      blocks.forEach(function (block) {
        interleavedEcc.push({
          kind: 'ecc',
          block: block.index,
          indexInBlock: i,
          value: block.ecc[i]
        });
      });
    }

    return {
      data: interleavedData,
      ecc: interleavedEcc,
      all: interleavedData.concat(interleavedEcc)
    };
  }

  // Final matrix assembly --------------------------------------------------

  // Build the boolean function-pattern matrix that the final symbol starts
  // from, plus a parallel reservation map used to keep data placement honest.
  function buildFunctionMatrix(version) {
    const size = 17 + 4 * version;
    const matrix = createMatrix(size, false);
    const reserved = createMatrix(size, false);

    // All function patterns write through mark() so the reservation map stays
    // in sync with the visible matrix.
    function mark(row, col, value) {
      matrix[row][col] = value;
      reserved[row][col] = true;
    }

    // Stamp one 7x7 finder pattern into the function matrix.
    function placeFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          mark(r0 + r, c0 + c, isOuter || isInner);
        }
      }
    }

    // Reserve one separator cell around a finder without changing an already
    // claimed function module.
    function placeSeparator(r, c) {
      if (r >= 0 && r < size && c >= 0 && c < size && !reserved[r][c]) {
        mark(r, c, false);
      }
    }

    // Alignment patterns are concentric 5x5 bulls-eyes.
    function placeAlignment(cr, cc) {
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const distance = Math.max(Math.abs(dr), Math.abs(dc));
          mark(cr + dr, cc + dc, distance === 2 || (dr === 0 && dc === 0));
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    for (let i = 0; i < 8; i++) {
      placeSeparator(7, i);
      placeSeparator(i, 7);
      placeSeparator(7, size - 8 + i);
      placeSeparator(i, size - 8);
      placeSeparator(size - 8, i);
      placeSeparator(size - 8 + i, 7);
    }

    for (let i = 8; i < size - 8; i++) {
      mark(6, i, i % 2 === 0);
      mark(i, 6, i % 2 === 0);
    }

    getAlignmentCenters(version).forEach(function (center) {
      placeAlignment(center[0], center[1]);
    });

    // The dark module is always present next to the lower-left timing path.
    mark(size - 8, 8, true);

    for (let i = 0; i <= 8; i++) {
      if (!reserved[8][i]) reserved[8][i] = true;
      if (!reserved[i][8]) reserved[i][8] = true;
    }
    for (let i = size - 8; i < size; i++) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }

    if (version >= 7) {
      for (let r = 0; r < 6; r++) {
        for (let c = size - 11; c <= size - 9; c++) {
          reserved[r][c] = true;
        }
      }
      for (let r = size - 11; r <= size - 9; r++) {
        for (let c = 0; c < 6; c++) {
          reserved[r][c] = true;
        }
      }
    }

    return { matrix: matrix, reserved: reserved };
  }

  // Format information uses a BCH code plus the fixed QR format mask.
  function buildFormatInfoValue(level, maskPattern) {
    const data = (FORMAT_INFO_ECC_BITS[level] << 3) | maskPattern;
    let remainder = data << 10;
    for (let bit = 14; bit >= 10; bit--) {
      if ((remainder >> bit) & 1) {
        remainder ^= FORMAT_GENERATOR << (bit - 10);
      }
    }
    return ((data << 10) | remainder) ^ FORMAT_MASK;
  }

  // Version information uses its own BCH generator and is only present on V7+.
  function buildVersionInfoValue(version) {
    let remainder = version << 12;
    for (let bit = 17; bit >= 12; bit--) {
      if ((remainder >> bit) & 1) {
        remainder ^= VERSION_GENERATOR << (bit - 12);
      }
    }
    return (version << 12) | remainder;
  }

  // Return the two mirrored coordinate lists used for the 15 format bits.
  function getFormatInfoCoordinates(size) {
    return {
      copyA: [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [7, 8], [8, 8], [8, 7], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0]],
      copyB: [[8, size - 1], [8, size - 2], [8, size - 3], [8, size - 4], [8, size - 5], [8, size - 6], [8, size - 7], [8, size - 8], [size - 7, 8], [size - 6, 8], [size - 5, 8], [size - 4, 8], [size - 3, 8], [size - 2, 8], [size - 1, 8]]
    };
  }

  // Return the two mirrored coordinate lists used for the 18 version bits.
  function getVersionInfoCoordinates(size) {
    const copyA = [];
    const copyB = [];
    for (let index = 0; index < 18; index++) {
      copyA.push([Math.floor(index / 3), size - 11 + (index % 3)]);
      copyB.push([size - 11 + (index % 3), Math.floor(index / 3)]);
    }
    return { copyA: copyA, copyB: copyB };
  }

  // Write one metadata bit sequence into both mirrored QR metadata regions.
  function writeMetadataBits(matrix, coordinates, bits, count) {
    for (let i = 0; i < count; i++) {
      const value = ((bits >> i) & 1) === 1;
      matrix[coordinates.copyA[i][0]][coordinates.copyA[i][1]] = value;
      matrix[coordinates.copyB[i][0]][coordinates.copyB[i][1]] = value;
    }
  }

  // Write the two mirrored copies of the format information bits.
  function placeFormatInfo(matrix, level, maskPattern) {
    const size = matrix.length;
    const bits = buildFormatInfoValue(level, maskPattern);
    const coordinates = getFormatInfoCoordinates(size);

    writeMetadataBits(matrix, coordinates, bits, 15);
    matrix[size - 8][8] = true;
  }

  // Write the two mirrored 18-bit version information blocks.
  function placeVersionInfo(matrix, version) {
    if (version < 7) return;
    const size = matrix.length;
    const bits = buildVersionInfoValue(version);
    const coordinates = getVersionInfoCoordinates(size);
    writeMetadataBits(matrix, coordinates, bits, 18);
  }

  // The eight standard QR mask formulae.
  function maskApplies(maskPattern, row, col) {
    switch (maskPattern) {
      case 0: return (row + col) % 2 === 0;
      case 1: return row % 2 === 0;
      case 2: return col % 3 === 0;
      case 3: return (row + col) % 3 === 0;
      case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
      case 6: return ((((row * col) % 2) + ((row * col) % 3)) % 2) === 0;
      case 7: return ((((row + col) % 2) + ((row * col) % 3)) % 2) === 0;
      default: return false;
    }
  }

  // Explode interleaved bytes into one entry per placed module bit so the UI
  // can track data/ECC/remainder modules precisely.
  function buildPlacementBits(interleavedCodewords, remainderCount) {
    const placed = [];
    interleavedCodewords.forEach(function (entry, codewordIndex) {
      for (let bitIndex = 7; bitIndex >= 0; bitIndex--) {
        placed.push({
          kind: entry.kind,
          codewordIndex: codewordIndex,
          block: entry.block,
          indexInBlock: entry.indexInBlock,
          bitIndex: bitIndex,
          value: (entry.value >> bitIndex) & 1,
          byteValue: entry.value
        });
      }
    });
    for (let i = 0; i < remainderCount; i++) {
      placed.push({
        kind: 'remainder',
        codewordIndex: null,
        block: null,
        indexInBlock: i,
        bitIndex: remainderCount - 1 - i,
        value: 0,
        byteValue: 0
      });
    }
    return placed;
  }

  // Populate the function matrix with interleaved payload/ECC bits in zig-zag
  // order, then layer version information on top when required.
  function buildBaseMatrix(version, interleavedAllCodewords) {
    const functionMatrix = buildFunctionMatrix(version);
    const matrix = cloneMatrix(functionMatrix.matrix);
    const moduleGrid = getModuleGrid(version);
    const points = getFullZigzagPath(moduleGrid.grid, moduleGrid.size);
    const placedBits = buildPlacementBits(interleavedAllCodewords, remainderBits[version - 1]);

    for (let i = 0; i < placedBits.length && i < points.length; i++) {
      const point = points[i];
      matrix[point[0]][point[1]] = placedBits[i].value === 1;
      placedBits[i].row = point[0];
      placedBits[i].col = point[1];
    }

    placeVersionInfo(matrix, version);

    return {
      matrix: matrix,
      reserved: functionMatrix.reserved,
      moduleGrid: moduleGrid,
      points: points,
      placedBits: placedBits
    };
  }

  // Apply a candidate mask only to data-bearing modules, never reserved ones.
  function applyMaskToMatrix(matrix, points, maskPattern) {
    points.forEach(function (point) {
      if (maskApplies(maskPattern, point[0], point[1])) {
        matrix[point[0]][point[1]] = !matrix[point[0]][point[1]];
      }
    });
  }

  // Mirror the mask effect into the explainer metadata so hover states reflect
  // the actual final bit values seen in the rendered symbol.
  function applyMaskToPlacedBits(placedBits, maskPattern) {
    return placedBits.map(function (entry) {
      const next = Object.assign({}, entry);
      next.maskedValue = entry.row == null ? entry.value : (maskApplies(maskPattern, entry.row, entry.col) ? entry.value ^ 1 : entry.value);
      return next;
    });
  }

  // Score a candidate masked matrix using the four QR mask penalty rules.
  function getPenaltyScore(matrix) {
    const size = matrix.length;
    let penalty = 0;

    // Rule 1: long runs of the same color.
    function applyRule1(getCell) {
      for (let outer = 0; outer < size; outer++) {
        let runColor = getCell(outer, 0);
        let runLength = 1;
        for (let inner = 1; inner < size; inner++) {
          const color = getCell(outer, inner);
          if (color === runColor) {
            runLength++;
          } else {
            if (runLength >= 5) penalty += 3 + (runLength - 5);
            runColor = color;
            runLength = 1;
          }
        }
        if (runLength >= 5) penalty += 3 + (runLength - 5);
      }
    }

    applyRule1(function (row, col) { return matrix[row][col]; });
    applyRule1(function (col, row) { return matrix[row][col]; });

    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size - 1; col++) {
        const color = matrix[row][col];
        if (matrix[row][col + 1] === color && matrix[row + 1][col] === color && matrix[row + 1][col + 1] === color) {
          penalty += 3;
        }
      }
    }

    const patternA = [true, false, true, true, true, false, true, false, false, false, false];
    const patternB = [false, false, false, false, true, false, true, true, true, false, true];

    // Rule 3: finder-like patterns in rows or columns.
    function applyRule3(getCell) {
      for (let outer = 0; outer < size; outer++) {
        for (let start = 0; start <= size - 11; start++) {
          let matchesA = true;
          let matchesB = true;
          for (let offset = 0; offset < 11; offset++) {
            const value = getCell(outer, start + offset);
            if (value !== patternA[offset]) matchesA = false;
            if (value !== patternB[offset]) matchesB = false;
          }
          if (matchesA || matchesB) penalty += 40;
        }
      }
    }

    applyRule3(function (row, col) { return matrix[row][col]; });
    applyRule3(function (col, row) { return matrix[row][col]; });

    // Rule 4: overall dark/light balance.
    let darkCount = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (matrix[row][col]) darkCount++;
      }
    }
    const totalModules = size * size;
    const k = Math.ceil(Math.abs(darkCount * 20 - totalModules * 10) / totalModules) - 1;
    penalty += Math.max(0, k) * 10;

    return penalty;
  }

  // Build the final QR symbol, test all eight masks, pick the lowest-penalty
  // candidate, and retain enough metadata for the explainer UI.
  function buildFinalQrData(encoded, version, eccLevel, options) {
    const generateOptions = options || {};
    const enableMask = generateOptions.enableMask !== false;
    const rsInfo = getRsBlockInfo(version, eccLevel);
    const blocks = buildRsBlocks(encoded.dataByteValues, version, eccLevel);
    const interleaved = interleaveBlocks(blocks, rsInfo.ecCodewordsPerBlock);
    const base = buildBaseMatrix(version, interleaved.all);
    let bestPattern = 0;
    let bestPenalty = Infinity;
    let bestMaskedMatrix = null;

    // Evaluate every legal mask pattern against the QR penalty rules.
    for (let maskPattern = 0; maskPattern < 8; maskPattern++) {
      const candidate = cloneMatrix(base.matrix);
      applyMaskToMatrix(candidate, base.points, maskPattern);
      placeFormatInfo(candidate, eccLevel, maskPattern);
      const penalty = getPenaltyScore(candidate);
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestPattern = maskPattern;
        bestMaskedMatrix = candidate;
      }
    }

    // Even when the caller disables masking for debugging, the best pattern is
    // still computed and reported so the choice remains inspectable.
    const formatInfoValue = buildFormatInfoValue(eccLevel, bestPattern);
    const formatInfoBits = formatInfoValue.toString(2).padStart(15, '0');
    const matrix = enableMask ? bestMaskedMatrix : cloneMatrix(base.matrix);
    placeFormatInfo(matrix, eccLevel, bestPattern);

    const moduleCount = matrix.length;
    const cellSize = Math.max(3, Math.floor(300 / (moduleCount + 8)));

    return {
      matrix: matrix,
      moduleCount: moduleCount,
      cellSize: cellSize,
      maskPattern: bestPattern,
      maskPenalty: bestPenalty,
      maskEnabled: enableMask,
      formatInfo: {
        value: formatInfoValue,
        bits: formatInfoBits,
        eccBits: formatInfoBits.slice(0, 2),
        maskBits: formatInfoBits.slice(2, 5),
        bchBits: formatInfoBits.slice(5)
      },
      rsBlocks: blocks.map(function (block) {
        return {
          group: block.group,
          index: block.index,
          data: block.data.slice(),
          ecc: block.ecc.slice()
        };
      }),
      interleavedCodewords: interleaved.all.map(function (entry, index) {
        return {
          index: index,
          kind: entry.kind,
          block: entry.block,
          indexInBlock: entry.indexInBlock,
          value: entry.value,
          hex: formatHexByte(entry.value)
        };
      }),
      placedBits: applyMaskToPlacedBits(base.placedBits, bestPattern)
    };
  }

  // Public entry point. This resolves the high-level payload type, encodes the
  // bitstream, derives structural metadata, and optionally produces the final
  // masked QR matrix.
  function generate(options, format, renderOptions) {
    const config = options || {};
    const version = config.version || 2;
    const ecc = config.ecc || 'M';
    const payloadInfo = buildPayloadInfo(config.type || 'text', config.inputs || {});
    const encoded = encodePayloadToCodewords(payloadInfo, version, ecc);
    const versionInfo = getVersionInfo(version, ecc);
    const moduleGrid = getModuleGrid(version);
    const zigzagPath = getFullZigzagPath(moduleGrid.grid, moduleGrid.size).map(function (point, index) {
      return { index: index, r: point[0], c: point[1] };
    });

    const model = Object.assign({}, encoded, {
      type: payloadInfo.type,
      inputs: deepClone(payloadInfo.inputs),
      version: version,
      ecc: ecc,
      versionInfo: versionInfo,
      moduleGrid: moduleGrid,
      zigzagPath: zigzagPath
    });

    if (encoded.ok) {
      model.finalQr = buildFinalQrData(encoded, version, ecc, { enableMask: config.enableMask !== false });
    }

    if (format != null) {
      if (!model.ok) {
        return Promise.reject(new Error(model.error || 'QR generation failed.'));
      }
      return generateAsset(model, format, Object.assign({ download: false }, renderOptions || {}));
    }

    return model;
  }

  // Public debug entry point. It either normalizes an in-memory generation
  // model into JSON-safe diagnostics or runs the binary-image debug pipeline.
  function debug(source, options) {
    const debugOptions = options || {};
    const isBinarySource = source instanceof Uint8Array
      || source instanceof ArrayBuffer
      || ArrayBuffer.isView(source)
      || Array.isArray(source);

    if (isBinarySource) {
      return DebugQR(source, debugOptions);
    }

    const model = source && source.finalQr ? source : generate(source || {});
    return Promise.resolve(deepClone({
      ok: Boolean(model && model.ok),
      type: model && model.type ? model.type : '',
      inputs: model && model.inputs ? model.inputs : {},
      version: model && model.version ? model.version : 0,
      ecc: model && model.ecc ? model.ecc : '',
      payloadInfo: model && model.payloadInfo ? model.payloadInfo : null,
      payloadText: model && model.payloadText ? model.payloadText : '',
      payloadBytes: model && model.payloadBytes ? model.payloadBytes : [],
      values: model && model.values ? model.values : [],
      charMap: model && model.charMap ? model.charMap : [],
      versionInfo: model && model.versionInfo ? model.versionInfo : null,
      moduleGrid: model && model.moduleGrid ? model.moduleGrid : null,
      zigzagPath: model && model.zigzagPath ? model.zigzagPath : [],
      finalQr: model && model.finalQr ? model.finalQr : null,
      error: model && model.error ? model.error : ''
    }));
  }

  // Accept either a full Generate model or a bare finalQr object and normalize
  // both into the final matrix structure required by the export pipeline.
  function resolveDownloadFinalQr(source) {
    if (source && source.finalQr && source.finalQr.matrix) return source.finalQr;
    if (source && Array.isArray(source.matrix)) return source;
    throw new Error('Asset generation expects a generated model or finalQr object with a matrix.');
  }

  // Limit export format names to the browser formats QR Peach knows how to
  // produce.
  function normalizeDownloadFormat(format) {
    const normalized = String(format || 'svg').toLowerCase();
    if (normalized === 'svg' || normalized === 'png') return normalized;
    if (normalized === 'jpg' || normalized === 'jpeg') return 'jpg';
    throw new Error('Download format must be svg, png, or jpg.');
  }

  // Convert one filename fragment into a safe lowercase slug for downloads.
  function sanitizeDownloadFilenamePart(value, fallback) {
    const normalized = String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return normalized || fallback;
  }

  // Build the default asset filename from the model metadata unless the caller
  // supplies an explicit filename.
  function getDownloadFilename(source, format, explicitFilename) {
    if (explicitFilename) return String(explicitFilename);
    const type = sanitizeDownloadFilenamePart(source && source.type, 'qr');
    const version = source && source.version ? 'v' + source.version : 'qr';
    const ecc = sanitizeDownloadFilenamePart(source && source.ecc, 'm');
    return 'qrpeach-' + type + '-' + version + '-' + ecc + '.' + format;
  }

  // Normalize the render settings shared by SVG, PNG, and JPG export paths.
  function getDownloadRenderConfig(source, options) {
    const finalQr = resolveDownloadFinalQr(source);
    const config = options || {};
    const cellSize = Math.max(1, Math.floor(config.cellSize || finalQr.cellSize || 8));
    const marginModules = config.marginModules == null ? 4 : Math.max(0, Math.floor(config.marginModules));
    const count = finalQr.matrix.length;
    const margin = marginModules * cellSize;
    return {
      finalQr: finalQr,
      matrix: finalQr.matrix,
      count: count,
      cellSize: cellSize,
      margin: margin,
      sizePx: count * cellSize + margin * 2,
      foreground: config.foreground || '#000000',
      background: config.background || '#ffffff'
    };
  }

  // Visit only dark modules in render space so both SVG and canvas exporters
  // share one traversal.
  function forEachDarkRenderModule(render, visit) {
    for (let row = 0; row < render.count; row++) {
      for (let col = 0; col < render.count; col++) {
        if (!render.matrix[row][col]) continue;
        visit(
          render.margin + col * render.cellSize,
          render.margin + row * render.cellSize,
          render.cellSize
        );
      }
    }
  }

  // Build a complete standalone SVG string for one QR symbol export.
  function buildDownloadSvgMarkup(source, options) {
    const render = getDownloadRenderConfig(source, options);
    let modules = '<rect width="' + render.sizePx + '" height="' + render.sizePx + '" fill="' + render.background + '"/>';
    forEachDarkRenderModule(render, function (x, y, size) {
      modules += '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" fill="' + render.foreground + '"/>';
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + render.sizePx + '" height="' + render.sizePx + '" viewBox="0 0 ' + render.sizePx + ' ' + render.sizePx + '">' + modules + '</svg>';
  }

  // Paint the final QR symbol into a browser canvas for PNG or JPG export.
  function buildDownloadCanvas(source, options) {
    if (typeof document === 'undefined') {
      throw new Error('PNG and JPG downloads require a browser document environment.');
    }
    const render = getDownloadRenderConfig(source, options);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D drawing is unavailable in this environment.');
    }

    canvas.width = render.sizePx;
    canvas.height = render.sizePx;
    context.fillStyle = render.background;
    context.fillRect(0, 0, render.sizePx, render.sizePx);
    context.fillStyle = render.foreground;

    forEachDarkRenderModule(render, function (x, y, size) {
      context.fillRect(x, y, size, size);
    });

    return canvas;
  }

  // Convert a populated canvas into a Blob using the requested image MIME type
  // and optional encoder quality.
  function canvasToDownloadBlob(canvas, mimeType, quality) {
    return new Promise(function (resolve, reject) {
      if (typeof canvas.toBlob !== 'function') {
        reject(new Error('Canvas blob export is unavailable in this environment.'));
        return;
      }
      canvas.toBlob(function (blob) {
        if (!blob) {
          reject(new Error('Canvas export failed.'));
          return;
        }
        resolve(blob);
      }, mimeType, quality);
    });
  }

  // Trigger a browser download for an already-built Blob and clean up its
  // temporary object URL immediately afterward.
  function triggerBrowserDownload(blob, filename) {
    if (typeof document === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      throw new Error('Browser download is unavailable in this environment.');
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    if (document.body) document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 0);
  }

  // Generate one render-ready asset object and optionally trigger a browser
  // download for it.
  async function generateAsset(source, format, options) {
    const config = options || {};
    const normalizedFormat = normalizeDownloadFormat(format);
    const filename = getDownloadFilename(source, normalizedFormat, config.filename);
    let blob;
    let mimeType;
    let svgMarkup = '';

    if (normalizedFormat === 'svg') {
      svgMarkup = buildDownloadSvgMarkup(source, config);
      mimeType = 'image/svg+xml';
      blob = new Blob([svgMarkup], { type: mimeType });
    } else if (normalizedFormat === 'png') {
      mimeType = 'image/png';
      blob = await canvasToDownloadBlob(buildDownloadCanvas(source, config), mimeType);
    } else {
      mimeType = 'image/jpeg';
      blob = await canvasToDownloadBlob(buildDownloadCanvas(source, config), mimeType, typeof config.quality === 'number' ? config.quality : 0.92);
    }

    if (config.download !== false) {
      triggerBrowserDownload(blob, filename);
    }

    return {
      format: normalizedFormat,
      filename: filename,
      mimeType: mimeType,
      blob: blob,
      size: blob.size,
      svg: svgMarkup
    };
  }

  // Normalize the supported byte container types that callers can pass into
  // the binary Debug image pipeline.
  function normalizeDebugImageBytes(input) {
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    if (Array.isArray(input)) return Uint8Array.from(input);
    throw new Error('Debug expects a Uint8Array, ArrayBuffer, TypedArray, or Array of byte values.');
  }

  // Infer an image MIME type from file signatures or an optional explicit hint.
  function inferDebugImageMime(bytes, explicitMime) {
    if (explicitMime) return explicitMime;
    if (bytes.length >= 8
      && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
      && bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) {
      return 'image/png';
    }
    if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      return 'image/jpeg';
    }
    if (typeof TextDecoder === 'function') {
      const header = new TextDecoder('utf-8').decode(bytes.slice(0, 256)).replace(/^\uFEFF/, '').trimStart();
      if (header.startsWith('<svg') || header.startsWith('<?xml')) return 'image/svg+xml';
    }
    return 'application/octet-stream';
  }

  // Build one structured debug issue entry in the consistent shape used by the
  // Debug API.
  function createDebugIssue(severity, code, message, detail) {
    return { severity: severity, code: code, message: message, detail: detail || '' };
  }

  // Decode a Blob into an HTMLImageElement when createImageBitmap is not used
  // or cannot handle the supplied bytes.
  function loadDebugImageElement(blob) {
    return new Promise(function (resolve, reject) {
      if (typeof Image === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
        reject(new Error('Image decoding is unavailable in this environment.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = function () {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Image bytes could not be decoded.'));
      };
      image.src = url;
    });
  }

  // Decode raw image bytes into a drawable browser image source.
  async function decodeDebugImageSource(bytes, mimeType) {
    if (typeof Blob === 'undefined') {
      throw new Error('Binary image decoding requires Blob support.');
    }
    const blob = new Blob([bytes], { type: mimeType });
    if (typeof createImageBitmap === 'function' && mimeType !== 'image/svg+xml') {
      try {
        return await createImageBitmap(blob);
      } catch (error) {
        // Fall back to Image for browsers that reject some byte streams.
      }
    }
    return loadDebugImageElement(blob);
  }

  // Draw the decoded image source into a canvas so the debug scanner can read
  // pixel luminance values directly.
  function rasterizeDebugImage(source) {
    if (typeof document === 'undefined') {
      throw new Error('Raster analysis requires a browser document environment.');
    }
    const width = source.width || source.naturalWidth || 0;
    const height = source.height || source.naturalHeight || 0;
    if (!width || !height) {
      throw new Error('The image decoded, but its dimensions could not be determined.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Canvas 2D drawing is unavailable in this environment.');
    }
    context.drawImage(source, 0, 0, width, height);
    return { canvas: canvas, imageData: context.getImageData(0, 0, width, height) };
  }

  // Measure brightness, bounds, contrast, and quiet-zone margins from a raster
  // image before QR-specific sampling begins.
  function analyzeDebugRaster(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const pixels = imageData.data;
    let minLum = 255;
    let maxLum = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const luminance = (pixels[i] * 0.2126) + (pixels[i + 1] * 0.7152) + (pixels[i + 2] * 0.0722);
      if (luminance < minLum) minLum = luminance;
      if (luminance > maxLum) maxLum = luminance;
    }

    const threshold = (minLum + maxLum) / 2;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let darkCount = 0;
    let darkLumSum = 0;
    let lightLumSum = 0;
    let lightCount = 0;

    for (let offset = 0; offset < pixels.length; offset += 4) {
      const index = offset / 4;
      const x = index % width;
      const y = Math.floor(index / width);
      const luminance = (pixels[offset] * 0.2126) + (pixels[offset + 1] * 0.7152) + (pixels[offset + 2] * 0.0722);
      if (luminance <= threshold) {
        darkCount += 1;
        darkLumSum += luminance;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      } else {
        lightCount += 1;
        lightLumSum += luminance;
      }
    }

    const hasDarkPixels = darkCount > 0;
    const bounds = hasDarkPixels
      ? {
          left: minX,
          top: minY,
          right: maxX,
          bottom: maxY,
          width: (maxX - minX) + 1,
          height: (maxY - minY) + 1
        }
      : null;

    return {
      width: width,
      height: height,
      isSquare: width === height,
      threshold: threshold,
      darkPixelRatio: hasDarkPixels ? darkCount / (width * height) : 0,
      contrast: lightCount > 0 && darkCount > 0 ? (lightLumSum / lightCount) - (darkLumSum / darkCount) : 0,
      bounds: bounds,
      quietZone: bounds ? {
        left: bounds.left,
        top: bounds.top,
        right: width - 1 - bounds.right,
        bottom: height - 1 - bounds.bottom
      } : null
    };
  }

  // Count differing bits between two integers while BCH-correcting format and
  // version metadata candidates.
  function countDebugBitDifferences(left, right) {
    let value = (left ^ right) >>> 0;
    let count = 0;
    while (value !== 0) {
      count += value & 1;
      value >>>= 1;
    }
    return count;
  }

  // Convert one array of boolean-like bits into an unsigned integer.
  function bitsToDebugNumber(bits) {
    let value = 0;
    bits.forEach(function (bit) {
      value = (value << 1) | (bit ? 1 : 0);
    });
    return value >>> 0;
  }

  // Regroup a flat bitstream into byte-sized debug records with decimal and
  // hexadecimal representations.
  function buildDebugCodewords(bits) {
    const codewords = [];
    for (let index = 0; index + 7 < bits.length; index += 8) {
      const byteBits = bits.slice(index, index + 8);
      const value = bitsToDebugNumber(byteBits);
      codewords.push({
        index: index / 8,
        bits: byteBits.join(''),
        value: value,
        hex: formatHexByte(value)
      });
    }
    return codewords;
  }

  // Tell the debug pipeline whether one module belongs to the mirrored format
  // metadata region rather than the data path.
  function isDebugFormatCell(size, row, col) {
    if (col === 8 && (((row >= 0 && row <= 8) && row !== 6) || row >= size - 7)) return true;
    if (row === 8 && (((col >= 0 && col <= 8) && col !== 6) || col >= size - 8)) return true;
    return false;
  }

  // Tell the debug pipeline whether one module belongs to the version metadata
  // region used in versions 7 and above.
  function isDebugVersionCell(version, row, col, size) {
    if (version < 7) return false;
    return (row >= 0 && row < 6 && col >= size - 11 && col <= size - 9)
      || (col >= 0 && col < 6 && row >= size - 11 && row <= size - 9);
  }

  // Compute luminance for one RGBA pixel using the standard perceptual channel
  // weights used elsewhere in the debug raster analysis.
  function getDebugPixelLuminance(pixels, offset) {
    return (pixels[offset] * 0.2126) + (pixels[offset + 1] * 0.7152) + (pixels[offset + 2] * 0.0722);
  }

  // Sample a small neighborhood around one module center and classify it as
  // dark or light.
  function sampleDebugModule(imageData, threshold, originX, originY, moduleWidth, moduleHeight, row, col) {
    const centerX = originX + (col + 0.5) * moduleWidth;
    const centerY = originY + (row + 0.5) * moduleHeight;
    const halfWidth = Math.max(0.5, moduleWidth * 0.2);
    const halfHeight = Math.max(0.5, moduleHeight * 0.2);
    const minX = Math.max(0, Math.floor(centerX - halfWidth));
    const maxX = Math.min(imageData.width - 1, Math.ceil(centerX + halfWidth));
    const minY = Math.max(0, Math.floor(centerY - halfHeight));
    const maxY = Math.min(imageData.height - 1, Math.ceil(centerY + halfHeight));
    let total = 0;
    let dark = 0;
    let luminanceSum = 0;

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const offset = (y * imageData.width + x) * 4;
        const luminance = getDebugPixelLuminance(imageData.data, offset);
        luminanceSum += luminance;
        total += 1;
        if (luminance <= threshold) dark += 1;
      }
    }

    if (total === 0) {
      const x = Math.max(0, Math.min(imageData.width - 1, Math.round(centerX)));
      const y = Math.max(0, Math.min(imageData.height - 1, Math.round(centerY)));
      const offset = (y * imageData.width + x) * 4;
      return getDebugPixelLuminance(imageData.data, offset) <= threshold;
    }

    return dark * 2 >= total || (luminanceSum / total) <= threshold;
  }

  // Sample every module for one candidate version and return the recovered
  // boolean module matrix plus the geometry used to produce it.
  function buildDebugSampledMatrix(imageData, imageStats, version) {
    const size = 17 + 4 * version;
    const bounds = imageStats.bounds;
    const moduleWidth = bounds.width / size;
    const moduleHeight = bounds.height / size;
    const matrix = createMatrix(size, false);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        matrix[row][col] = sampleDebugModule(imageData, imageStats.threshold, bounds.left, bounds.top, moduleWidth, moduleHeight, row, col);
      }
    }

    return {
      version: version,
      size: size,
      matrix: matrix,
      moduleWidth: moduleWidth,
      moduleHeight: moduleHeight,
      originX: bounds.left,
      originY: bounds.top
    };
  }

  // Score one candidate version by comparing its sampled function modules with
  // the expected finder, timing, alignment, and dark-module pattern.
  function scoreDebugVersionCandidate(imageData, imageStats, version) {
    const sampled = buildDebugSampledMatrix(imageData, imageStats, version);
    const functionMatrix = buildFunctionMatrix(version);
    let mismatchCount = 0;
    let knownCount = 0;

    for (let row = 0; row < sampled.size; row++) {
      for (let col = 0; col < sampled.size; col++) {
        if (!functionMatrix.reserved[row][col]) continue;
        if (isDebugFormatCell(sampled.size, row, col) || isDebugVersionCell(version, row, col, sampled.size)) continue;
        knownCount += 1;
        if (sampled.matrix[row][col] !== functionMatrix.matrix[row][col]) {
          mismatchCount += 1;
        }
      }
    }

    const quietZone = imageStats.quietZone || { left: 0, top: 0, right: 0, bottom: 0 };
    const quietZoneModules = {
      left: sampled.moduleWidth ? quietZone.left / sampled.moduleWidth : 0,
      top: sampled.moduleHeight ? quietZone.top / sampled.moduleHeight : 0,
      right: sampled.moduleWidth ? quietZone.right / sampled.moduleWidth : 0,
      bottom: sampled.moduleHeight ? quietZone.bottom / sampled.moduleHeight : 0
    };
    const quietPenalty = Math.abs(quietZoneModules.left - 4)
      + Math.abs(quietZoneModules.top - 4)
      + Math.abs(quietZoneModules.right - 4)
      + Math.abs(quietZoneModules.bottom - 4);
    const moduleSkew = Math.abs(sampled.moduleWidth - sampled.moduleHeight) / Math.max(sampled.moduleWidth, sampled.moduleHeight, 1);

    sampled.mismatchCount = mismatchCount;
    sampled.knownCount = knownCount;
    sampled.mismatchRate = knownCount ? mismatchCount / knownCount : 1;
    sampled.quietZoneModules = quietZoneModules;
    sampled.score = sampled.mismatchRate * 100 + quietPenalty + moduleSkew * 10;
    return sampled;
  }

  // Test every legal QR version and keep the sampled matrix whose fixed
  // patterns best match the image.
  function detectDebugModuleMatrix(imageData, imageStats) {
    if (!imageStats.bounds) return null;
    let best = null;
    for (let version = 1; version <= 40; version++) {
      const candidate = scoreDebugVersionCandidate(imageData, imageStats, version);
      if (!best || candidate.score < best.score) {
        best = candidate;
      }
    }
    return best;
  }

  // Read one metadata bitfield from the sampled module matrix using an ordered
  // coordinate list.
  function readDebugBitField(matrix, coordinates) {
    let value = 0;
    for (let index = 0; index < coordinates.length; index++) {
      const point = coordinates[index];
      if (matrix[point[0]][point[1]]) {
        value |= (1 << index);
      }
    }
    return value >>> 0;
  }

  // Decode the two mirrored format strings by choosing the BCH candidate with
  // the fewest bit errors.
  function decodeDebugFormatInfo(matrix) {
    const size = matrix.length;
    const coordinates = getFormatInfoCoordinates(size);
    const valueA = readDebugBitField(matrix, coordinates.copyA);
    const valueB = readDebugBitField(matrix, coordinates.copyB);
    let best = null;

    Object.keys(FORMAT_INFO_ECC_BITS).forEach(function (level) {
      for (let maskPattern = 0; maskPattern < 8; maskPattern++) {
        const value = buildFormatInfoValue(level, maskPattern);
        const errorA = countDebugBitDifferences(valueA, value);
        const errorB = countDebugBitDifferences(valueB, value);
        const score = errorA + errorB;
        if (!best || score < best.score) {
          best = {
            level: level,
            maskPattern: maskPattern,
            value: value,
            score: score,
            errorA: errorA,
            errorB: errorB
          };
        }
      }
    });

    return {
      level: best.level,
      maskPattern: best.maskPattern,
      value: best.value,
      bits: best.value.toString(2).padStart(15, '0'),
      copyA: {
        value: valueA,
        bits: valueA.toString(2).padStart(15, '0'),
        errorBits: best.errorA
      },
      copyB: {
        value: valueB,
        bits: valueB.toString(2).padStart(15, '0'),
        errorBits: best.errorB
      }
    };
  }

  // Decode the mirrored 18-bit version blocks for versions 7 and above.
  function decodeDebugVersionInfo(matrix) {
    const size = matrix.length;
    const version = (size - 17) / 4;
    if (version < 7) return null;

    const coordinates = getVersionInfoCoordinates(size);
    const valueA = readDebugBitField(matrix, coordinates.copyA);
    const valueB = readDebugBitField(matrix, coordinates.copyB);
    let best = null;

    for (let candidate = 7; candidate <= 40; candidate++) {
      const value = buildVersionInfoValue(candidate);
      const errorA = countDebugBitDifferences(valueA, value);
      const errorB = countDebugBitDifferences(valueB, value);
      const score = errorA + errorB;
      if (!best || score < best.score) {
        best = {
          version: candidate,
          value: value,
          score: score,
          errorA: errorA,
          errorB: errorB
        };
      }
    }

    return {
      version: best.version,
      value: best.value,
      bits: best.value.toString(2).padStart(18, '0'),
      copyA: {
        value: valueA,
        bits: valueA.toString(2).padStart(18, '0'),
        errorBits: best.errorA
      },
      copyB: {
        value: valueB,
        bits: valueB.toString(2).padStart(18, '0'),
        errorBits: best.errorB
      }
    };
  }

  // Reverse QR codeword interleaving for the data portion of a recovered raw
  // data bitstream.
  function deinterleaveDebugDataBits(dataBits, blockInfo) {
    const interleavedCodewords = buildDebugCodewords(dataBits).map(function (entry) {
      return entry.value;
    });
    const blocks = [];

    blockInfo.groups.forEach(function (group) {
      for (let blockIndex = 0; blockIndex < group.blocks; blockIndex++) {
        blocks.push(new Array(group.dataCodewords));
      }
    });

    let offset = 0;
    const maxDataLength = blocks.reduce(function (longest, block) {
      return Math.max(longest, block.length);
    }, 0);

    for (let indexInBlock = 0; indexInBlock < maxDataLength; indexInBlock++) {
      blocks.forEach(function (block) {
        if (indexInBlock < block.length && offset < interleavedCodewords.length) {
          block[indexInBlock] = interleavedCodewords[offset];
          offset += 1;
        }
      });
    }

    const dataCodewords = [];
    blocks.forEach(function (block) {
      block.forEach(function (value) {
        if (typeof value === 'number') {
          dataCodewords.push(value);
        }
      });
    });

    return dataCodewords.reduce(function (bits, value) {
      return bits.concat(value.toString(2).padStart(8, '0').split('').map(function (bit) {
        return bit === '1' ? 1 : 0;
      }));
    }, []);
  }

  // Interpret a recovered byte-mode payload stream and report payload bytes,
  // terminator bits, alignment bits, and pad-codeword health.
  function decodeDebugBytePayload(dataBits, version) {
    const countBitLength = getByteModeCountBits(version);
    const modeBits = dataBits.slice(0, 4).join('');
    const countBits = dataBits.slice(4, 4 + countBitLength).join('');
    const payloadStart = 4 + countBitLength;
    const payloadCapacityBytes = Math.max(0, Math.floor((dataBits.length - payloadStart) / 8));
    const byteCount = bitsToDebugNumber(dataBits.slice(4, 4 + countBitLength));
    const payloadByteCount = Math.min(byteCount, payloadCapacityBytes);
    const payloadBytes = [];

    for (let index = 0; index < payloadByteCount; index++) {
      const byteStart = payloadStart + index * 8;
      payloadBytes.push(bitsToDebugNumber(dataBits.slice(byteStart, byteStart + 8)));
    }

    let decodedText = '';
    if (payloadBytes.length > 0) {
      try {
        decodedText = typeof TextDecoder === 'function'
          ? new TextDecoder('utf-8').decode(Uint8Array.from(payloadBytes))
          : payloadBytes.map(function (value) { return String.fromCharCode(value); }).join('');
      } catch (error) {
        decodedText = '';
      }
    }

    const payloadEnd = payloadStart + payloadByteCount * 8;
    const terminatorLength = Math.min(4, Math.max(0, dataBits.length - payloadEnd));
    const terminatorBits = dataBits.slice(payloadEnd, payloadEnd + terminatorLength).join('');
    const alignStart = payloadEnd + terminatorLength;
    const alignLength = (8 - (alignStart % 8)) % 8;
    const alignBits = dataBits.slice(alignStart, alignStart + alignLength).join('');
    const padCodewords = buildDebugCodewords(dataBits.slice(alignStart + alignLength));
    const unexpectedPad = padCodewords.filter(function (entry) {
      return entry.value !== PAD_CODEWORDS[entry.index % PAD_CODEWORDS.length];
    });

    return {
      modeBits: modeBits,
      countBits: countBits,
      byteCount: byteCount,
      payloadBits: dataBits.slice(payloadStart, payloadEnd).join(''),
      payloadBytes: payloadBytes,
      decodedText: decodedText,
      terminatorBits: terminatorBits,
      alignBits: alignBits,
      padCodewords: padCodewords,
      issues: {
        unsupportedMode: modeBits !== MODE_BITS.byte,
        countOverflow: byteCount > payloadCapacityBytes,
        nonZeroTerminator: /1/.test(terminatorBits),
        nonZeroAlignment: /1/.test(alignBits),
        unexpectedPad: unexpectedPad
      }
    };
  }

  // Run the end-to-end browser-side debug scan for a PNG, JPEG, or SVG QR
  // image and return structured diagnostics about the recovered symbol.
  async function DebugQR(imageBytes, options) {
    const config = options || {};
    const bytes = normalizeDebugImageBytes(imageBytes);
    const mimeType = inferDebugImageMime(bytes, config.mimeType || config.type || '');
    const issues = [];

    const result = {
      ok: false,
      mimeType: mimeType,
      byteLength: bytes.length,
      sourceLabel: config.sourceLabel || '',
      image: null,
      engine: { name: 'Debug internal virtual scan', externalDependencies: false },
      decodedText: '',
      symbol: null,
      issues: issues
    };

    if (mimeType !== 'image/png' && mimeType !== 'image/jpeg' && mimeType !== 'image/svg+xml') {
      issues.push(createDebugIssue('error', 'unsupported-image-type', 'Debug only supports PNG, JPEG, and SVG image bytes.', 'Detected MIME: ' + mimeType));
      return result;
    }

    try {
      const source = await decodeDebugImageSource(bytes, mimeType);
      const raster = rasterizeDebugImage(source);
      const imageStats = analyzeDebugRaster(raster.imageData);
      const sampled = imageStats.bounds ? detectDebugModuleMatrix(raster.imageData, imageStats) : null;

      result.image = Object.assign({}, imageStats);

      if (!imageStats.isSquare) {
        issues.push(createDebugIssue('warning', 'image-not-square', 'The image is not square, which often indicates cropping or scaling distortion.', imageStats.width + 'x' + imageStats.height));
      }
      if (Math.min(imageStats.width, imageStats.height) < 96) {
        issues.push(createDebugIssue('warning', 'image-small', 'The image is very small. Downsampling can blur module edges and hurt scanning.', imageStats.width + 'x' + imageStats.height));
      }
      if (!imageStats.bounds) {
        issues.push(createDebugIssue('error', 'no-dark-modules', 'No dark module region was detected after thresholding the image.', 'The image may be blank or too low contrast.'));
      } else {
        const quiet = imageStats.quietZone;
        const minQuiet = Math.min(quiet.left, quiet.top, quiet.right, quiet.bottom);
        if (minQuiet <= 1) {
          issues.push(createDebugIssue('warning', 'quiet-zone-cropped', 'The dark module region nearly touches the image edge. Missing quiet zone is a common scan failure.', 'Margins: L' + quiet.left + ' T' + quiet.top + ' R' + quiet.right + ' B' + quiet.bottom + ' px'));
        }
      }
      if (imageStats.contrast < 80) {
        issues.push(createDebugIssue('warning', 'low-contrast', 'Foreground and background contrast looks low, which can make the QR harder to scan.', 'Estimated luminance delta: ' + imageStats.contrast.toFixed(1)));
      }

      if (!sampled) {
        issues.push(createDebugIssue('error', 'virtual-scan-failed', 'Debug could not infer a QR module grid from the image.', 'Function patterns did not match any QR version closely enough.'));
        return result;
      }

      result.image.modulePitch = {
        x: sampled.moduleWidth,
        y: sampled.moduleHeight
      };
      result.image.quietZoneModules = sampled.quietZoneModules;
      result.image.moduleCount = sampled.size;

      if (sampled.mismatchRate > 0.12) {
        issues.push(createDebugIssue('error', 'virtual-scan-uncertain', 'The internal virtual scan found too many function-pattern mismatches to trust the decoded bitstream.', 'Mismatch rate: ' + (sampled.mismatchRate * 100).toFixed(1) + '%'));
      } else if (sampled.mismatchRate > 0.02) {
        issues.push(createDebugIssue('warning', 'virtual-scan-corrected', 'The internal virtual scan recovered the QR grid, but some function modules did not sample cleanly.', 'Mismatch rate: ' + (sampled.mismatchRate * 100).toFixed(1) + '%'));
      }

      const formatInfo = decodeDebugFormatInfo(sampled.matrix);
      const versionInfo = decodeDebugVersionInfo(sampled.matrix);
      const version = sampled.version;
      const size = sampled.size;
      const moduleGrid = getModuleGrid(version);
      const points = getFullZigzagPath(moduleGrid.grid, size);
      const blockInfo = getRsBlockInfo(version, formatInfo.level);
      const blockCount = blockInfo.groups.reduce(function (total, group) { return total + group.blocks; }, 0);
      const dataBitCount = blockInfo.dataCodewords * 8;
      const eccBitCount = blockInfo.ecCodewordsPerBlock * blockCount * 8;
      const remainderBitCount = remainderBits[version - 1];
      const expectedBitCount = dataBitCount + eccBitCount + remainderBitCount;

      if (points.length !== expectedBitCount) {
        issues.push(createDebugIssue('error', 'bitstream-shape-mismatch', 'The decoded QR path length does not match the expected data/ECC/remainder totals for the inferred version and ECC level.', 'Expected ' + expectedBitCount + ' bits, sampled ' + points.length + '.'));
      }

      if (formatInfo.copyA.errorBits > 0 || formatInfo.copyB.errorBits > 0) {
        issues.push(createDebugIssue('warning', 'format-info-corrected', 'Debug had to BCH-correct one or both format-info copies while decoding the symbol metadata.', 'Copy A errors: ' + formatInfo.copyA.errorBits + ', copy B errors: ' + formatInfo.copyB.errorBits));
      }

      if (versionInfo && versionInfo.version !== version) {
        issues.push(createDebugIssue('warning', 'version-info-mismatch', 'The version bits disagree with the version inferred from the module geometry.', 'Geometry: V' + version + ', version bits: V' + versionInfo.version));
      } else if (versionInfo && (versionInfo.copyA.errorBits > 0 || versionInfo.copyB.errorBits > 0)) {
        issues.push(createDebugIssue('warning', 'version-info-corrected', 'Debug had to BCH-correct one or both version-info copies while decoding the symbol metadata.', 'Copy A errors: ' + versionInfo.copyA.errorBits + ', copy B errors: ' + versionInfo.copyB.errorBits));
      }

      const placedBits = points.map(function (point, index) {
        const maskedBit = sampled.matrix[point[0]][point[1]] ? 1 : 0;
        const rawBit = maskApplies(formatInfo.maskPattern, point[0], point[1]) ? (maskedBit ^ 1) : maskedBit;
        return {
          index: index,
          row: point[0],
          col: point[1],
          maskedBit: maskedBit,
          rawBit: rawBit
        };
      });

      const interleavedDataBits = placedBits.slice(0, dataBitCount).map(function (entry) { return entry.rawBit; });
      const eccBits = placedBits.slice(dataBitCount, dataBitCount + eccBitCount).map(function (entry) { return entry.rawBit; });
      const remainderStream = placedBits.slice(dataBitCount + eccBitCount, dataBitCount + eccBitCount + remainderBitCount).map(function (entry) { return entry.rawBit; });
      const dataBits = deinterleaveDebugDataBits(interleavedDataBits, blockInfo);
      const byteMode = decodeDebugBytePayload(dataBits, version);

      if (byteMode.issues.unsupportedMode) {
        issues.push(createDebugIssue('error', 'unsupported-mode', 'The recovered data stream does not start with the byte-mode indicator that this runtime expects.', 'Mode bits: ' + byteMode.modeBits));
      }
      if (byteMode.issues.countOverflow) {
        issues.push(createDebugIssue('error', 'payload-count-overflow', 'The recovered byte count exceeds the available payload bytes in the data stream.', 'Count field: ' + byteMode.byteCount + ' bytes.'));
      }
      if (byteMode.issues.nonZeroTerminator) {
        issues.push(createDebugIssue('warning', 'terminator-nonzero', 'The terminator bits after the payload are not all zero.', byteMode.terminatorBits));
      }
      if (byteMode.issues.nonZeroAlignment) {
        issues.push(createDebugIssue('warning', 'alignment-nonzero', 'The byte-alignment padding bits are not all zero.', byteMode.alignBits));
      }
      if (byteMode.issues.unexpectedPad.length > 0) {
        issues.push(createDebugIssue('warning', 'pad-pattern-mismatch', 'The remaining data codewords do not follow the expected alternating 0xEC/0x11 pad-byte pattern.', 'Unexpected pad bytes: ' + byteMode.issues.unexpectedPad.map(function (entry) { return entry.index + ':' + entry.hex; }).join(', ')));
      }

      result.decodedText = byteMode.decodedText;
      result.symbol = {
        version: version,
        moduleCount: size,
        eccLevel: formatInfo.level,
        maskPattern: formatInfo.maskPattern,
        formatInfo: formatInfo,
        versionInfo: versionInfo,
        bitCounts: {
          data: dataBitCount,
          ecc: eccBitCount,
          remainder: remainderBitCount
        },
        bitstreams: {
          metadata: [formatInfo.bits, versionInfo ? versionInfo.bits : ''].filter(Boolean).join(' '),
          format: formatInfo.bits,
          version: versionInfo ? versionInfo.bits : '',
          data: dataBits.join(''),
          ecc: eccBits.join(''),
          remainder: remainderStream.join('')
        },
        codewords: {
          data: buildDebugCodewords(dataBits),
          ecc: buildDebugCodewords(eccBits)
        },
        byteMode: {
          modeBits: byteMode.modeBits,
          countBits: byteMode.countBits,
          byteCount: byteMode.byteCount,
          payloadBits: byteMode.payloadBits,
          payloadBytes: byteMode.payloadBytes,
          terminatorBits: byteMode.terminatorBits,
          alignBits: byteMode.alignBits,
          padCodewords: byteMode.padCodewords
        }
      };

      result.ok = !issues.some(function (issue) { return issue.severity === 'error'; });
      return result;
    } catch (error) {
      issues.push(createDebugIssue('error', 'image-decode-failed', 'Debug could not decode the supplied image bytes.', error && error.message ? error.message : 'Unknown decode failure.'));
      return result;
    }
  }

  // Browser-global API surface.
  const api = {
    Generate: generate,
    Debug: debug
  };

  // QRPeach is the browser-global API surface.
  global.QRPeach = api;
})(typeof window !== 'undefined' ? window : this);
