import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../types';
import { motion } from 'motion/react';

interface Props {
  members: FamilyMember[];
}

export default function FamilyTree({ members }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || members.length === 0) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Convert flat data to hierarchy
    let treeDataToStratify = [...members];
    const roots = members.filter(m => !m.parentId);
    
    if (roots.length > 1) {
      // Add a virtual root to connect multiple heads of family
      const virtualRootId = 'virtual-root';
      treeDataToStratify.push({
        id: virtualRootId,
        name: 'خاندان',
        gender: 'other' as any,
      });
      
      // Point all current roots to the virtual root
      treeDataToStratify = treeDataToStratify.map(m => {
        if (!m.parentId && m.id !== virtualRootId) {
          return { ...m, parentId: virtualRootId };
        }
        return m;
      });
    }

    const stratify = d3.stratify<FamilyMember>()
      .id(d => d.id)
      .parentId(d => d.parentId);

    let root;
    try {
      root = stratify(treeDataToStratify);
    } catch (e) {
      console.error("Hierarchy error:", e);
      return;
    }

    const width = 1200;
    const height = 800;
    const margin = { top: 60, right: 120, bottom: 60, left: 120 };

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree<FamilyMember>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const treeData = treeLayout(root);

    // Links with smooth curves
    svg.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', d => '5,5') // Dashed lines for a modern look
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Nodes
    const nodes = svg.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Node background glow
    nodes.append('circle')
      .attr('r', 18)
      .attr('fill', d => d.data.gender === 'female' ? '#fdf2f8' : '#f0fdf4')
      .attr('stroke', d => d.data.gender === 'female' ? '#f472b6' : '#10b981')
      .attr('stroke-width', 2);

    // Inner icon or dot
    nodes.append('circle')
      .attr('r', 6)
      .attr('fill', d => d.data.gender === 'female' ? '#f472b6' : '#10b981');

    // Labels with premium typography
    nodes.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.children ? -25 : 25)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-size', '15px')
      .attr('font-weight', '600')
      .attr('fill', '#1a1c1e')
      .text(d => d.data.name);

    // Add relation text (optional)
    nodes.append('text')
      .attr('dy', '1.6em')
      .attr('x', d => d.children ? -25 : 25)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text(d => d.depth === 0 ? 'سربراہ' : '');

  }, [members]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-2xl premium-shadow border border-slate-100 overflow-auto flex justify-center min-h-[700px] relative" 
      id="tree-container"
    >
      {members.length > 0 ? (
        <svg ref={svgRef} className="max-w-full h-auto"></svg>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-300 gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-slate-400 urdu-text">شجرہ نسب کا آغاز کریں</p>
            <p className="text-sm text-slate-400">بائیں جانب فارم کا استعمال کرتے ہوئے ارکان شامل کریں</p>
          </div>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-premium-gold/20"></div>
        <div className="w-2 h-2 rounded-full bg-premium-gold/40"></div>
        <div className="w-2 h-2 rounded-full bg-premium-gold/60"></div>
      </div>
    </motion.div>
  );
}
