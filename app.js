/**
 * 대한민국 보건복지부 소개 웹 애플리케이션 JS
 * 순수 바닐라 JavaScript (빌드 프레임워크 없음, 로컬 더블클릭 실행 가능)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initNewsFilter();
  initFaqAccordion();
  initChecklistSurvey();
  initSmoothScroll();
});

/* -------------------------------------------------------------
 * 1. 생애주기별 혜택 탭 전환 기능
 * ------------------------------------------------------------- */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 2. 최신 정책 뉴스 필터링 기능
 * ------------------------------------------------------------- */
function initNewsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 3. 자주 묻는 질문(FAQ) 아코디언 기능
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. 국민 맞춤 설문 & 체크리스트 ("어떤 도움을 받을 수 있을까?")
 * ------------------------------------------------------------- */
function initChecklistSurvey() {
  const stepDots = document.querySelectorAll('.step-dot');
  const progressBar = document.getElementById('surveyProgressBar');
  const steps = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3'),
    4: document.getElementById('step4')
  };
  const surveyForm = document.getElementById('checklistForm');
  const surveyResultBox = document.getElementById('surveyResultBox');
  const submitChecklistBtn = document.getElementById('submitChecklistBtn');
  const recheckBtn = document.getElementById('recheckBtn');

  // Next / Prev 버튼 핸들러
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'), 10);
      goToStep(nextStep);
    });
  });

  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(prevStep);
    });
  });

  function goToStep(stepNum) {
    Object.values(steps).forEach(s => s && s.classList.remove('active'));
    if (steps[stepNum]) {
      steps[stepNum].classList.add('active');
    }

    stepDots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active');
      if (dotStep === stepNum) {
        dot.classList.add('active');
      } else if (dotStep < stepNum) {
        dot.classList.add('completed');
      } else {
        dot.classList.remove('completed');
      }
    });

    if (progressBar) {
      progressBar.style.width = `${stepNum * 25}%`;
    }

    const container = document.querySelector('.survey-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 설문 제출 및 결과 분석
  if (submitChecklistBtn) {
    submitChecklistBtn.addEventListener('click', () => {
      analyzeChecklist();
    });
  }

  // 재진단 버튼
  if (recheckBtn) {
    recheckBtn.addEventListener('click', () => {
      surveyResultBox.style.display = 'none';
      surveyForm.style.display = 'block';
      surveyForm.reset();
      goToStep(1);
    });
  }

  function analyzeChecklist() {
    // 1. 생애주기
    const ageSelected = document.querySelector('input[name="surveyAge"]:checked')?.value || 'infant';
    
    // 2. 체크박스 선택값 수집
    const incomeSituations = Array.from(document.querySelectorAll('input[name="incomeSituation"]:checked')).map(el => el.value);
    const healthSituations = Array.from(document.querySelectorAll('input[name="healthSituation"]:checked')).map(el => el.value);
    const careSituations = Array.from(document.querySelectorAll('input[name="careSituation"]:checked')).map(el => el.value);

    // 결과 데이터 컨테이너
    const incomeBenefits = [];
    const medicalBenefits = [];
    const careBenefits = [];
    const summaryTags = [];

    // 생애주기 라벨 매핑
    const ageNames = {
      infant: "영유아·임산부 가구",
      youth: "아동·청소년 가구",
      young: "청년 (만 19~34세)",
      middle: "중장년 (만 35~64세)",
      senior: "어르신 (만 65세 이상)"
    };
    summaryTags.push(`<span class="sum-tag"><i class="fa-solid fa-user"></i> ${ageNames[ageSelected]}</span>`);

    // --- 생애주기 기반 기본 혜택 배정 ---
    if (ageSelected === 'infant') {
      incomeBenefits.push({
        tag: "출산·양육 지원금",
        title: "부모급여 (월 최대 100만 원)",
        desc: "0세(0~11개월) 아동을 둔 가구에 월 100만 원, 1세(12~23개월) 아동에게 월 50만 원의 양육비 지급 (어린이집 이용 시 보육료 바우처 차액 지급)",
        dept: "보건복지부 보육정책관"
      });
      incomeBenefits.push({
        tag: "첫만남 바우처",
        title: "첫만남이용권 (200만~300만 원)",
        desc: "출생 아동에게 첫째아 200만 원, 둘째아 이상 300만 원의 국민행복카드 바우처를 일시 지급하여 초기 육아비용 지원",
        dept: "보건복지부 출산정책과"
      });
      medicalBenefits.push({
        tag: "무료 검진·접종",
        title: "영유아 건강검진 및 18종 국가예방접종 전액 지원",
        desc: "생후 14일부터 71개월까지 총 8회에 걸친 성장·발달 선별검사 무료 실시 및 BCG, B형간염 등 필수 백신 18종 무료 접종",
        dept: "질병관리청 / 보건복지부 공공보건정책관"
      });
    } else if (ageSelected === 'youth') {
      incomeBenefits.push({
        tag: "보편 수당",
        title: "아동수당 (만 8세 미만 월 10만 원)",
        desc: "부모의 소득과 무관하게 모든 아동에게 매월 25일 10만 원씩 현금 지급하여 건강한 성장 환경 보장",
        dept: "보건복지부 아동복지정책과"
      });
      careBenefits.push({
        tag: "학교·방과후 돌봄",
        title: "다함께돌봄센터 & 방과후아카데미 연계",
        desc: "초등학생 방과 후 돌봄 공백을 해소하기 위한 지역사회 중심의 맞춤형 돌봄 및 학습·놀이 프로그램 제공",
        dept: "보건복지부 인구아동정책관"
      });
    } else if (ageSelected === 'young') {
      incomeBenefits.push({
        tag: "청년 목돈 모으기",
        title: "청년내일저축계좌",
        desc: "일하는 청년이 매월 10만 원 저축 시 소득에 따라 정부가 월 10만~30만 원을 매칭 적립 (3년 만기 시 최대 1,440만 원 수령)",
        dept: "보건복지부 청년정책지원팀"
      });
      medicalBenefits.push({
        tag: "청년 건강검진",
        title: "2030 청년 국가건강검진 전액 지원",
        desc: "만 20세 이상 건강보험 피부양자 및 세대원 청년 대상 2년 주기 신체계측, 혈액검사, 흉부X선 등 무료 검진",
        dept: "국민건강보험공단 / 보건복지부"
      });
    } else if (ageSelected === 'middle') {
      medicalBenefits.push({
        tag: "중장년 건강검진",
        title: "일반건강검진 및 6대 암검진 지원",
        desc: "만 40세 이상 대상 2년 주기 위암, 간암, 대장암, 유방암, 자궁경부암, 폐암 등 국가 무료/감면 암검진 지원",
        dept: "국민건강보험공단 / 보건복지부"
      });
      careBenefits.push({
        tag: "중장년 돌봄",
        title: "중장년 일상돌봄 서비스",
        desc: "질병, 고립 등으로 돌봄이 필요한 중장년 가구에게 가사 지원, 식사 영양관리, 병원동행 등 바우처 제공",
        dept: "보건복지부 사회서비스사업과"
      });
    } else if (ageSelected === 'senior') {
      incomeBenefits.push({
        tag: "노후 소득 보장",
        title: "기초연금 (월 최대 334,810원)",
        desc: "만 65세 이상 어르신 중 소득인정액 기준 하위 70% 어르신에게 매월 지급되는 대표적 노후 소득 지원",
        dept: "보건복지부 기초연금과"
      });
      incomeBenefits.push({
        tag: "노인 일자리",
        title: "노인 일자리 및 사회활동 지원사업 (100만+)",
        desc: "공익활동(스쿨존 안전 등), 사회서비스형(보육교사 보조), 민간 취업형 등 역량에 맞는 100만 개 이상 일자리 제공",
        dept: "보건복지부 노인지원과"
      });
      careBenefits.push({
        tag: "어르신 돌봄",
        title: "노인장기요양보험 및 노인맞춤돌봄서비스",
        desc: "거동이 불편한 어르신을 위한 요양보호사의 방문요양·목욕, 주야간보호 급여 및 독거 어르신 안부 확인",
        dept: "국민건강보험공단 / 보건복지부 요양보험운영과"
      });
    }

    // --- 소득·생계 상황 기반 추가 혜택 ---
    if (incomeSituations.includes('crisis')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-triangle-exclamation text-danger"></i> 위기상황 긴급구호 대상</span>');
      incomeBenefits.unshift({
        tag: "즉시 긴급구호 (선지원 후심사)",
        title: "긴급복지지원제도 (생계·의료·주거비)",
        desc: "주소득자의 사망, 실직, 화재, 중한 질병으로 위기에 처한 가구에 129 전화 즉시 생계비(4인가구 월 183만 원 수준) 및 긴급의료비(최대 300만 원) 즉각 지급",
        dept: "보건복지부 기초생활보장과 / 129 보건복지상담센터"
      });
    }

    if (incomeSituations.includes('basicLiving')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-shield"></i> 기초생활보장 대상</span>');
      incomeBenefits.push({
        tag: "기초생활보장",
        title: "국민기초생활보장 생계급여 및 주거·교육급여",
        desc: "기준중위소득 32% 이하 가구 대상 최저생활 보장비 현금 지급 (2024~2026년 기준중위소득 대폭 인상 반영)",
        dept: "보건복지부 기초생활보장과"
      });
      medicalBenefits.push({
        tag: "의료비 본인부담 면제/감면",
        title: "기초생활보장 의료급여 1종/2종",
        desc: "병원 진료 및 입원 시 진료비 본인부담금을 0원~10% 수준으로 대폭 감면하여 빈곤층 의료 공백 방지",
        dept: "보건복지부 기초의료보장과"
      });
    }

    if (incomeSituations.includes('assetBuilding') && ageSelected !== 'young') {
      incomeBenefits.push({
        tag: "저소득 자산형성",
        title: "희망저축계좌 Ⅰ·Ⅱ",
        desc: "일하는 생계·의료·주거·교육급여 수급자 및 차상위 계층이 매월 저축 시 정부가 월 10만~30만 원을 매칭 적립 지원",
        dept: "보건복지부 자활지원과"
      });
    }

    if (incomeSituations.includes('debtSmallBiz')) {
      incomeBenefits.push({
        tag: "사회보험료 감면",
        title: "두루누리 사회보험료 80% 지원사업",
        desc: "근로자 수 10명 미만 사업장의 월보수 270만 원 미만 근로자와 사업주에게 국민연금·고용보험료 80%를 국가가 직접 지원",
        dept: "국민연금공단 / 근로복지공단"
      });
    }

    // --- 건강·의료 상황 기반 추가 혜택 ---
    if (healthSituations.includes('catastrophic')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-hospital text-danger"></i> 중증·재난적 의료비 지원</span>');
      medicalBenefits.unshift({
        tag: "고액 의료비 환급",
        title: "재난적 의료비 지원사업 (최대 5,000만 원)",
        desc: "가구 소득 대비 과도한 의료비 발생 시 입원·외래 진료비 중 본인부담금(비급여 포함)의 50~80%를 국가가 환급 지원",
        dept: "국민건강보험공단 / 보건복지부 필수의료총괄과"
      });
    }

    if (healthSituations.includes('mental')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-head-side-heart text-primary"></i> 마음건강 심리지원</span>');
      medicalBenefits.push({
        tag: "전국민 마음돌봄",
        title: "전국민 마음투자 심리상담 바우처 지원",
        desc: "우울·불안 등으로 심리상담이 필요한 국민에게 전문 심리상담센터 1:1 상담 바우처 총 8회(회당 7~8만 원 상당) 전액/차등 지원",
        dept: "보건복지부 정신건강관리과"
      });
      medicalBenefits.push({
        tag: "24시간 위기전화",
        title: "자살예방 상담전화 109 & 정신건강복지센터 연계",
        desc: "언제 어디서나 109번으로 24시간 전문 위기상담 가능 및 전국 260여 개 정신건강복지센터에서 사례관리 무료 제공",
        dept: "보건복지부 자살예방정책과"
      });
    }

    if (healthSituations.includes('chronic')) {
      medicalBenefits.push({
        tag: "만성질환 집중케어",
        title: "일차의료 만성질환관리 시범사업 (진료비 감면)",
        desc: "동네 의원에서 고혈압·당뇨병 환자에게 맞춤 케어플랜 수립, 영양·운동 교육 및 진료 본인부담률 감면(20%→10%) 혜택",
        dept: "보건복지부 건강정책과"
      });
    }

    if (healthSituations.includes('pregnancyCare')) {
      medicalBenefits.push({
        tag: "임신·출산 의료비",
        title: "난임부부 시술비 지원 확대 & 고위험 임산부 의료비 지원",
        desc: "소득 기준 없이 모든 난임부부에게 체외수정/인공수정 시술비 지원 횟수 대폭 확대 및 고위험 질환 입원진료비 90% 지원",
        dept: "보건복지부 출산정책과"
      });
    }

    // --- 돌봄 및 가족 상황 기반 추가 혜택 ---
    if (careSituations.includes('infantCare')) {
      careBenefits.push({
        tag: "가정방문 돌봄",
        title: "산모·신생아 건강관리 지원사업 & 아이돌봄서비스",
        desc: "출산 후 전문 건강관리사가 가정에 방문하여 산후조리 지원 바우처 제공, 생후 3개월~만 12세 이하 아동 대상 시간제/종일제 아이돌보미 파견",
        dept: "보건복지부 / 여성가족부 협력"
      });
    }

    if (careSituations.includes('elderlyCare') && ageSelected !== 'senior') {
      careBenefits.push({
        tag: "어르신 부양 가족 지원",
        title: "노인장기요양보험 가족요양비 & 안심치매센터",
        desc: "거동이 불편한 부모님을 돌보는 가족을 위한 요양급여 및 전국 256개 치매안심센터를 통한 치매검진·쉼터·위생용품 무료 지원",
        dept: "보건복지부 치매정책과"
      });
    }

    if (careSituations.includes('disabledCare')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-hands-holding-child text-secondary"></i> 발달장애인·장애인 돌봄</span>');
      careBenefits.unshift({
        tag: "2026 집중 정책",
        title: "최중증 발달장애인 1:1 맞춤형 24시간 통합돌봄",
        desc: "도전적 행동으로 돌봄이 어려웠던 발달장애인과 가족을 위한 1:1 전담 돌봄사 배치, 24시간 주거지원 및 주간 그룹활동 전담 제공",
        dept: "보건복지부 장애인서비스과"
      });
      incomeBenefits.push({
        tag: "장애인 소득안정",
        title: "장애인연금 및 장애수당",
        desc: "만 18세 이상 중증장애인 중 소득하위 70% 대상 매월 기초급여+부가급여 지급으로 생활안정 지원",
        dept: "보건복지부 장애인자립기반과"
      });
    }

    if (careSituations.includes('youngCaregiver')) {
      summaryTags.push('<span class="sum-tag"><i class="fa-solid fa-user-group text-primary"></i> 가족돌봄청년(영케어러)</span>');
      careBenefits.unshift({
        tag: "영케어러 지원",
        title: "가족돌봄청년 자기돌봄비 (연 200만 원) & 일상돌봄",
        desc: "아픈 가족을 전담 간병하느라 학업·취업에 어려움을 겪는 만 13~34세 청년에게 자기개발비 연 200만 원 현금 지급 및 가사·간병 도우미 파견",
        dept: "보건복지부 청년정책지원팀"
      });
    }

    // 렌더링 함수 실행
    renderReport({
      summaryTags,
      incomeBenefits,
      medicalBenefits,
      careBenefits
    });
  }

  function renderReport(data) {
    const summaryWrap = document.getElementById('resultSummaryTags');
    const incomeGrid = document.getElementById('incomeBenefitGrid');
    const medicalGrid = document.getElementById('medicalBenefitGrid');
    const careGrid = document.getElementById('careBenefitGrid');

    if (summaryWrap) {
      summaryWrap.innerHTML = data.summaryTags.join('');
    }

    function createBenefitCards(items) {
      if (items.length === 0) {
        return '<p style="grid-column: 1/-1; color:#64748b; font-size:0.92rem; padding: 1rem 0;">해당 영역에서 선택된 특이사항이 없습니다. 필요 시 129에 문의하시면 추가 지원을 받으실 수 있습니다.</p>';
      }
      return items.map(item => `
        <div class="benefit-item-card">
          <span class="item-tag">${item.tag}</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <div class="dept-info"><i class="fa-solid fa-building"></i> 담당부서: ${item.dept}</div>
        </div>
      `).join('');
    }

    if (incomeGrid) incomeGrid.innerHTML = createBenefitCards(data.incomeBenefits);
    if (medicalGrid) medicalGrid.innerHTML = createBenefitCards(data.medicalBenefits);
    if (careGrid) careGrid.innerHTML = createBenefitCards(data.careBenefits);

    // 폼 숨기고 결과 표시
    surveyForm.style.display = 'none';
    surveyResultBox.style.display = 'block';
    surveyResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* -------------------------------------------------------------
 * 5. 부드러운 스크롤 (Anchor Link)
 * ------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
